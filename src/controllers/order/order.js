import Branch from "../../models/branch.js";
import {Customer,DeliveryPartner} from "../../models/user.js";
import Order from "../../models/order.js";

export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body; // Ensure totalPrice is correctly cased
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if (!customerData || !branchData) {
            return reply.code(404).send({ message: "Customer or branch not found" });
        }

        const newOrder = new Order({
            orderId:"OD0001",
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count,
            })),
            branch: branch,
            totalPrice: totalPrice, // Ensure this is correctly accessed
            deliveryLocation: {
                latitude: customerData.liveLocation ? customerData.liveLocation.latitude : null,
                longitude: customerData.liveLocation ? customerData.liveLocation.longitude : null,
                address: customerData.address || "No address available",
            },
            pickupLocation: {
                latitude: branchData.location ? branchData.location.latitude : null,
                longitude: branchData.location ? branchData.location.longitude : null,
                address: branchData.address || "No address available",
            },
        });
        const savedOrder = await newOrder.save(); // Save the order to the database

        return reply
            .code(201)
            .send({ message: "Order created successfully", order: savedOrder }); // Return the saved order
    } catch (error) {
        return reply
            .code(500)
            .send({ message: "Internal server error", error: error.message });
    }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return reply.code(404).send({ message: "Delivery person not found" });
    }
    console.log(orderId,"orderId for socket");
    const order = await Order.findById(orderId);

    if (!order) {
      return reply.code(404).send({ message: "Order not found" });
    }
    if (order.status !== "available") {
      return reply
        .code(403)
        .send({ message: "Order is not available for delivery" });
    }
    order.status = "confirmed";
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = {
      latitude: deliveryPersonLocation.latitude,
      longitude: deliveryPersonLocation.longitude,
      address: deliveryPersonLocation.address || "",
    };
    console.log(`Emitting orderConfirmed event for orderId: ${orderId}`);
    req.server.io.to(orderId).emit("orderConfirmed",order);
    await order.save();
    return reply
      .code(200)
      .send({ message: "Order confirmed successfully", order: order });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPersonLocation } = req.body;
    const { userId } = req.user;
    const deliveryPerson = await DeliveryPartner.findById(userId);
    if (!deliveryPerson) {
      return reply.code(404).send({ message: "Delivery person not found" });
    }
    const order = await Order.findById(orderId);
    if (!order)return reply.code(404).send({ message: "Order not found" });
     // Check if the order is already delivered
     if (order.status === "delivered") {
        return reply.code(403).send({ message: "Order is already delivered and cannot be updated" });
      }
  
    if (["cancelled"].includes(status)) {
      return reply.code(403).send({ message: "Order is not confirmed" });
    }
    if (order.deliveryPartner.toString() !== userId) {
      return reply.code(403).send({ message: "unauthorized access" });
    }
    order.status = status;
    order.deliveryPartner = userId;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();
    req.server.io.to(orderId).emit("liveTracking",orderId);
    return reply
      .code(200)
      .send({ message: "Order status updated successfully", order: order });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to update order status", error: error.message });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { userId } = req.user;
    console.log(userId,"userId");
    const { status, customerId, deliveryPartnerId, branchId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (customerId) query.customer = customerId;
    if (deliveryPartnerId) {
      query.deliveryPartner = deliveryPartnerId;
      query.branch = branchId;
    }
    const orders = await Order.find(query).populate("customer branch items.item deliveryPartner");
    return reply.code(200).send({ orders: orders });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Internal server error", error: error.message });
  }
};
export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;
    console.log(orderId,"orderId");
    const order = await Order.findOne({orderId:orderId}).populate("customer branch items.item deliveryPartner");
    if(!order){
      return reply.code(404).send({message:"Order not found"});
    }
    return reply.code(200).send({ order: order });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

export const fetchCustomerOrders = async (req, reply) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ customer: userId }).populate("customer branch items.item deliveryPartner");
    return reply.code(200).send({ orders: orders });
  } catch (error) {
    return reply.code(500).send({ message: "Internal server error", error: error.message });
  }
}

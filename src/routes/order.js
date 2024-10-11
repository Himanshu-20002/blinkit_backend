import { createOrder, getOrders, updateOrderStatus, confirmOrder, getOrderById } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = (fastify, options, done) => {
    fastify.post("/order",{ preHandler: verifyToken }, createOrder,); // No authentication required for creating an order
    fastify.get("/order", { preHandler: verifyToken }, getOrders); // Authentication required
    fastify.patch("/order/:orderId/status", { preHandler: verifyToken }, updateOrderStatus); // Authentication required
    fastify.post("/order/:orderId/confirm", { preHandler: verifyToken }, confirmOrder); // Authentication required
    fastify.post("/order/:orderId", { preHandler: verifyToken }, getOrderById); // Authentication required
    
    done();
};

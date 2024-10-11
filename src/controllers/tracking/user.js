import { Customer, DeliveryPartner } from "../../models/user.js";

// This function updates a user's information based on their role (customer or deliveryPartner)
export const updateUser = async (req, reply) => {
  try {
    // Extracting the user's ID from the request
    const { userId } = req.user;
    // Getting the update data from the request body
    const updateData = req.body;
    // Attempting to find the user by their ID in both Customer and DeliveryPartner models
    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));
    // If the user is not found, return a 404 error
    if (!user) {
      return reply.code(404).send({ message: "user not found" });
    }
    // Determining the user model based on their role
    let UserModel;
    if (user.role === "customer") {
      UserModel = Customer;
    } else if (user.role === "deliveryPartner") {
      UserModel = DeliveryPartner;
    } else {
      // If the user role is neither customer nor deliveryPartner, return a 400 error
      return reply.code(400).send({ message: "invalid user role" });
    }
    // Updating the user's information using the determined model
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    // If the update operation fails to find the user, return a 404 error
    if (!updatedUser) {
      return reply.code(404).send({ message: "user not found" });
    }
    // If the update is successful, return a 200 response with the updated user
    return reply
      .code(200)
      .send({ message: "user updated successfully", user: updatedUser });
  } catch (error) {
    // If an error occurs during the update process, return a 500 error with the error message
    return reply
      .code(500)
      .send({ message: "internal server error", error: error.message });
  }
};


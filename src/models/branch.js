import mongoose from "mongoose";
// Branch Schema
// This schema is for the branches of the restaurant
const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { latitude: { type: Number }, longitude: { type: Number } },
  address: { type: String, required: true },
  deliveryPartners: [
    { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
  ],
  // this is the reference to the delivery partners of the branch
  // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  // // this is the reference to the orders of the branch
});
const Branch = mongoose.model("Branch", branchSchema);
export default Branch
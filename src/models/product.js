import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {type:mongoose.Schema.Types.ObjectId,ref:"Subcategory",required:true },
    sharedLink: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
  
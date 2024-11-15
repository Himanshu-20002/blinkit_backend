import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    image:{type:String,required:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true},
});

const Subcategory = mongoose.model("Subcategory",subcategorySchema)
export default Subcategory
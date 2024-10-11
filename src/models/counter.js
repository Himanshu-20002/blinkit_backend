// Importing mongoose for database operations
import mongoose from "mongoose";

// Defining the schema for the Counter model
const counterSchema = new mongoose.Schema({
    // The name of the counter, required and unique
    name:{type:String,required:true,unique:true},
    // The sequence value of the counter, default is 0
    sequenceValue:{type:Number,default:0}
});

// Creating the Counter model based on the schema
const Counter = mongoose.model("Counter",counterSchema);

// Exporting the Counter model
export default Counter;

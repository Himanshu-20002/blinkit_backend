import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // here we are creating a class of userSchema which is a blueprint of the user in the database
  // we are creating a schema for the user
  //then we are creating constructor object{}
  //And ther we can add more properties to the user field:name ||type: string, || required: true

  name: { type: String, required: true },
  role: {
    type: String,
    required: true, 
    enum: ["user", "admin", "delivery"],
    default: "user",
  },
  isActived: { type: Boolean, default: false },
  

});

//Customer Schema
const customerSchema = new mongoose.Schema({...userSchema.obj,
    phone:{type:Number,required:true,unique:true},
    role:{type:String,enum:["customer"],default:"customer"},
    liveLocation:{latitude:{type:Number},longitude:{type:Number}},
    address:{type:String,required:true},

});

//DeliveryPartner Schema
const deliveryPartnerSchema = new mongoose.Schema({...userSchema.obj,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:Number,required:true,unique:true},
    role:{type:String,enum:["deliveryPartner"],default:"deliveryPartner"},
    liveLocation:{latitude:{type:Number},longitude:{type:Number}},
    address:{type:String,required:true},
    branch:{type:mongoose.Schema.Types.ObjectId,ref:"Branch",},
    // thid is the reference to the branch where the delivery partner is working
    vehicleDetails:{type:String,required:true},
    isActive:{type:Boolean,default:false},
    isAvailable:{type:Boolean,default:false},
    currentOrder:{type:mongoose.Schema.Types.ObjectId,ref:"Order"},
    // this is the reference to the order that the delivery partner is currently delivering
    deliveryHistory:{type:mongoose.Schema.Types.ObjectId,ref:"Order"},
    // this is the reference to the order that the delivery partner has delivered
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true, unique: true},
    role: {type: String, enum: ["admin"], default: "admin"},
    isActive: {type: Boolean, default: false},
    isAvailable: {type: Boolean, default: false},
    currentOrder: {type: mongoose.Schema.Types.ObjectId, ref: "Order"},
    // this is the reference to the order that the admin is currently delivering
});


export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
export const Admin = mongoose.model("Admin", adminSchema);

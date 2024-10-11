import {Customer,DeliveryPartner,Admin} from "../../models/index.js"
import jwt from "jsonwebtoken"

const generateToken = (user) => {
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" }) // Added definition for accessToken
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken }
}

export const loginCustomer = async (req,reply)=>{
    try{
        const {phone} = req.body
        const customer = await Customer.findOne({phone})
        if(!customer){
            customer = new Customer({phone,role:"customer",isActivated:true})
            await customer.save()
        }
        const {accessToken,refreshToken} = generateToken(customer)
        return reply.send({message:customer?"Login successful":"Customer not found",
            accessToken,refreshToken,customer
        })
    }catch(error){
        console.log(error)
        return reply.code(500).send({message:"Internal server error",error})
    }

}

export const loginDeliveryPartner = async (req,reply)=>{
    try{
        const {email,password} = req.body
        const deliveryPartner = await DeliveryPartner.findOne({email})
        if(!deliveryPartner){
          return reply.code(404).send({message:"Delivery partner not found"})
        }
        const isMatch = password === deliveryPartner.password
        if(!isMatch){
            return reply.code(401).send({message:"Invalid password"})
        }
        const {accessToken,refreshToken} = generateToken(deliveryPartner)
        return reply.send({message:"Login successful",accessToken,refreshToken,deliveryPartner})
    }catch(error){
        console.log(error)
        return reply.code(500).send({message:"Internal server error",error})
    }  

    } 
    
export const refreshToken = async (req,reply)=>{
        const {refreshToken} = req.body
        if(!refreshToken){
            return reply.code(401).send({message:"Refresh token is required"})
        }
        try{
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            let user;
            if(decoded.role === "customer"){
                user = await Customer.findById(decoded.userId)
            }else if(decoded.role === "deliveryPartner"){
                user = await DeliveryPartner.findById(decoded.userId)
            }else{
                return reply.code(401).send({message:"Invalid token"})
            }            
            if(!user){
                return reply.code(401).send({message:"User not found"})
            }
            const {accessToken,refreshToken:newRefreshToken} = generateToken(user)
            return reply.send({message:"Token refreshed",accessToken,refreshToken:newRefreshToken})
        }catch(error){
            console.log(error)
            return reply.code(500).send({message:"Internal server error",error})
        }
    }
    export const fetchUser = async (req, reply) => {
        console.log("im the fetch user")
        try {
            const { userId, role } = req.user; // Ensure req.user is populated
            console.log("im the fetch user",userId,role)
            let user;
 
            if (role === "customer") {
                user = await Customer.findById(userId);
            } else if (role === "deliveryPartner") {
                user = await DeliveryPartner.findById(userId);
            } else {
                return reply.code(401).send({ message: "Invalid token" });
            }
 
            if (!user) {
                return reply.code(404).send({ message: "User not found" });
            }
 
            return reply.send({ message: "User fetched", user });
        } catch (error) {
            console.log(error);
            return reply.code(500).send({ message: "Internal server error", error });
        }
    };

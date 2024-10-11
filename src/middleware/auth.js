import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config(); // Ensure environment variables are loaded
export const verifyToken = (req, reply,next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({ message: "access token is required  yos" });
        }
        const token = authHeader.split(" ")[1];
        console.log("Token received:", token);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        console.log("req.user",req.user)
        next()
    } catch (error) {
        console.error("Token verification error:", error); // Log the error
        return reply.code(403).send({ message: "invalid token or token expired" }); // Return response
    }
}

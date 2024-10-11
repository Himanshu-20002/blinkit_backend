import { loginCustomer, loginDeliveryPartner, refreshToken, fetchUser, } from "../controllers/auth/auth.js";
import { updateUser } from "../controllers/tracking/user.js";
import { verifyToken } from "../middleware/auth.js";

export const authRoutes = (fastify, opts, done) => {
    fastify.post('/customer/login', loginCustomer);
    fastify.post('/delivery/login', loginDeliveryPartner);
    fastify.post('/refresh-token', refreshToken);
    fastify.get('/user', { preHandler: verifyToken }, fetchUser); // Ensure this line is present
    fastify.patch('/user', { preHandler: verifyToken }, updateUser);
   
    done();
};
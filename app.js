import dotenv from 'dotenv';
import Fastify from 'fastify';
import { connectDB } from './src/config/connect.js';
dotenv.config();

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        const app = Fastify();
        const PORT = process.env.PORT || 3000;
        
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Blinkit server is running on ${PORT}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

start();

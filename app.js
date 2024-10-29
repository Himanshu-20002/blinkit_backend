import dotenv from "dotenv";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { buildAdminRouter ,admin} from "./src/config/setup.js";
import { PORT } from "./src/config/config.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";


const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();
  app.register(fastifySocketIO,{
    cors:{
      origin:"*"
    },
    pingTimeout:10000,
    pingInterval:5000,
    transports:["websocket"]
  })
  await registerRoutes(app);
  await buildAdminRouter(app);

    

    app.listen({ port: PORT, host: "0.0.0.0" },(err,addr)=>{
      if(err){
        console.log(err);
      }else{
        console.log(`Blinkit server is running on http://localhost:${PORT}${admin.options.rootPath}`);
      }
    });

  app.ready().then(()=>{
    app.io.on("connection",(socket)=>{
      console.log("User Connected 🟢",socket.id);
      socket.on("joinRoom",(orderId)=>{
        socket.join(orderId);
        console.log(`User ${socket.id} joined room ✅️${orderId}`);
      })
      socket.on('disconnect',()=>{
        console.log(`User ${socket.id} disconnected 🚩`);
      })
    })
  })
};

start();

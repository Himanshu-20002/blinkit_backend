import dotenv from "dotenv";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { buildAdminRouter ,admin} from "./src/config/setup.js";
import { PORT } from "./src/config/config.js";



const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();
  await buildAdminRouter(app);

    

    app.listen({ port: PORT, host: "0.0.0.0" },(err,addr)=>{
      if(err){
        console.log(err);
      }else{
        console.log(`Blinkit server is running on http://localhost:${PORT}${admin.options.rootPath}`);
      }
    });

  
};

start();

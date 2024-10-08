import AdminJS from "adminjs";
import AdminJSFastify from "adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
//`AdminJSMongoose`: The adapter that allows AdminJS to work with Mongoose models.
import * as Models from "../models/index.js";

AdminJS.registerAdapter(AdminJSMongoose);
//This line registers the Mongoose adapter with AdminJS, enabling it to interact with Mongoose models.

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.Branch,
    },
  ],
  branding:{
    companyName:"Blinkit",
    withMadeWithLove:false,
  },
  rootPath:'/admin'
});

export const buildAdminRouter =async(app)=>{
    await AdminJSFastify.buldAuthenticatedRouter{
        admin,
        {

        },
        app,
        {
            store:session

        }

    }
}

import AdminJS from "adminjs";
import AdminJSFastify from "adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
//`AdminJSMongoose`: The adapter that allows AdminJS to work with Mongoose models.
import * as Models from "../models/index.js";

AdminJS.registerAdapter(AdminJSMongoose);
//This line registers the Mongoose adapter with AdminJS, enabling it to interact with Mongoose models.
//This sectoion define the data models that will be managed by the admin panel
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
  //This line sets the root path for the admin panel to '/admin'.
});

//This function builds an authenticated router for the admin panel.
export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter({
        admin, // The admin instance to use for the router.
        app, // The Fastify app to attach the router to.
        store: session // The session store to use for authentication.
    });
}

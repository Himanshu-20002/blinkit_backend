import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { authenticate, sessionStore } from "./config.js";
AdminJS.registerAdapter(AdminJSMongoose);
//This line registers the Mongoose adapter with AdminJS, enabling it to interact with Mongoose models.
//This sectoion define the data models that will be managed by the admin panel
import {dark,light,noSidebar} from "@adminjs/themes"
export const admin = new AdminJS({

  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["email", "role"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Product,
    },
    {
      resource: Models.Category,
    },
    {
      resource: Models.Order,
    },
    {
      resource: Models.Counter,
    },
  ],
  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
    favicon: "/https://seeklogo.com/images/B/blinkit-logo-568D32C8EC-seeklogo.com.png",
    logo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjyjf6vesMmJy_yDwxmL76J2uwHUqBGSvZVA&s"
  },
  defaultTheme: dark.id,
  availableThemes: [dark,light,noSidebar],
  rootPath: "/admin",
  //This line sets the root path for the admin panel to '/admin'.
});
//This function builds an authenticated router for the admin panel.
export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    { authenticate, cookiePassword: process.env.COOKIE_PASSWORD, cookieName: "adminjs" },
    app, 
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: process.env.COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production", // Make the cookie HTTP only in production.
        secure: process.env.NODE_ENV === "production", // Make the cookie secure in production.
      },
    }
  );
};

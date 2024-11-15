import { getAllCategories } from "../controllers/product/category.js";
import { getProductByCategoryId } from "../controllers/product/product.js";
import { getAllSubcategories, createSubcategory } from "../controllers/product/subcategory.js";

export const categoryRoutes =  (fastify, options, done) => {
  fastify.get("/categories", getAllCategories);
  done();
};

export const productRoutes =  (fastify, options, done) => {
  fastify.get("/product/:categoryId", getProductByCategoryId);
  done();
};

export const subcategoryRoutes = (fastify,options,done) => {
    fastify.get("/subcategories", getAllSubcategories);
    fastify.post("/subcategories", createSubcategory);
    done();
};



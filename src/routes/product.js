import { getAllCategories } from "../controllers/product/category.js";
import { getProductByCategoryId, getProductBySubCategoryId ,getProducts} from "../controllers/product/product.js";
import { getAllSubcategories } from "../controllers/product/subcategory.js";

export const categoryRoutes =  (fastify, options, done) => {
  fastify.get("/categories", getAllCategories);
  done();
};

export const productRoutes =  (fastify, options, done) => {
  fastify.get("/product/:categoryId", getProductByCategoryId);
  fastify.get("/product", getProducts);
  fastify.get("/product/subcategory/:subCategoryId", getProductBySubCategoryId); 
  done();
};

export const subcategoryRoutes = (fastify,options,done) => {
    fastify.get("/subcategories", getAllSubcategories);
    // fastify.post("/subcategories", createSubcategory);
    done();
};



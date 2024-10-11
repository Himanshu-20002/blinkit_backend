import Category from "../../models/category.js";

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find();
    console.log("Categories found:", categories); // Log the retrieved categories   (hi dudes ,)
    return reply.send(categories);
  } catch (error) {
    console.error("Error fetching categories:", error); // Log the error
    return reply.code(500).send({ message: "Internal server error", error: error.message });
  }
};
import Product from "../../models/product.js";

export const getProductByCategoryId = async (req, reply) => {
    const { categoryId } = req.params;
    try {
        // Check if categoryId is valid
        if (!categoryId) {
            return reply.code(400).send({ message: "Category ID is required" });
        }

        const product = await Product.find({ category: categoryId })
            .select("-category")
        //   .populate("category", "name") // Uncomment if you need category details
            .exec();

        // Check if products were found
        if (product.length === 0) {
            return reply.code(404).send({ message: "No products found for this category" });
        }

        return reply.send(product);
    } catch (error) {
        return reply.code(500).send({ message: "Internal server error", error: error.message });
    }
}

// New function to get products by subCategoryId
export const getProductBySubCategoryId = async (req, reply) => {
    const { subCategoryId } = req.params;
    try {
        // Check if subCategoryId is valid
        if (!subCategoryId) {
            return reply.code(400).send({ message: "Subcategory ID is required" });
        }

        const product = await Product.find({ subCategory: subCategoryId })
            .select("-subCategory")
            // .populate("subCategory", "name") // Uncomment if you need subcategory details
            .exec();

        // Check if products were found
        if (product.length === 0) {
            return reply.code(404).send({ message: "No products found for this subcategory" });
        }

        return reply.send(product);
    } catch (error) {
        return reply.code(500).send({ message: "Internal server error", error: error.message });
    }
}
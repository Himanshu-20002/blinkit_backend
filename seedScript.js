import mongoose from "mongoose"
import "dotenv/config.js";
import {Product, Category, Subcategory} from "./src/models/index.js"
import {categories, products, subCategories} from "./seedData.js"

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        // Delete existing data
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Subcategory.deleteMany({});

        const categoryDoc = await Category.insertMany(categories);
        const categoryMap = categoryDoc.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});

        const subCategoriesWithIds = subCategories.map(subCategory => {
            const categoryId = categoryMap[subCategory.category];
            if (!categoryId) {
                console.error(`Category not found for subcategory: ${subCategory.name}`);
            }
            return {
                ...subCategory,
                category: categoryId
            };
        }).filter(subCategory => subCategory.category);

        const subCategoryDoc = await Subcategory.insertMany(subCategoriesWithIds);
        const subCategoryMap = subCategoryDoc.reduce((map, subCategory) => {
            map[subCategory.name] = subCategory._id;
            return map;
        }, {});

        console.log("Category Map:", categoryMap);
        console.log("Subcategory Map:", subCategoryMap);

        const productWithCategoryAndSubCategoryIds = products.map((product) => {
            const categoryId = categoryMap[product.category];
            const subCategoryId = subCategoryMap[product.subCategory];

            if (!categoryId) {
                console.error(`Category not found for product: ${product.name}`);
            }
            if (!subCategoryId) {
                console.error(`Subcategory not found for product: ${product.name}, Subcategory: ${product.subCategory}, Category: ${product.category}`);
            }

            return {
                ...product,
                category: categoryId,
                subCategory: subCategoryId,
                description: "Default Description"
            };
        }).filter(product => {
            const hasValidImage = product.images && product.images.length > 0;
            const isValid = product.category && hasValidImage && product.subCategory;
            if (!isValid) {
                console.warn(`Product excluded: ${product.name}, Category: ${product.category}, Subcategory: ${product.subCategory}`);
            }
            return isValid;
        });

        await Product.insertMany(productWithCategoryAndSubCategoryIds);
        console.log("Data seeded successfully");

    } catch (error) {
        console.log("Error seeding data", error);
    } finally {
        mongoose.connection.close();
    }
}

seedData();
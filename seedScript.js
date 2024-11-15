import mongoose from "mongoose"
import "dotenv/config.js";
import {Product,Category,Subcategory} from "./src/models/index.js"
import {categories,products} from"./seedData.js"
import { subcategories } from "./seedSubcategories.js";

async function seedData(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        // await Category.deleteMany({});
        // await Product.deleteMany({});
        const categoryDoc = await Category.insertMany(categories)
        const categoryMap = categoryDoc.reduce((map,category)=>{
            map[category.name] = category._id
            return map
        },{})
        const productWithCategoryIds = products.map((product)=>({
            ...product,
           
            category:categoryMap[product.category],
            description: "Default Description"
        }))
        await Product.insertMany(productWithCategoryIds)
        console.log("Data seeded successfully")

        // Seed subcategories
        await Subcategory.insertMany(subcategories);
        console.log("Subcategories seeded successfully");
    }catch(error){
        console.log("Error seeding data",error)
    }finally{
        mongoose.connection.close()
    }
}

seedData()
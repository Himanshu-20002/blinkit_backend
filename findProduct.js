import fs from "fs";
import path from "path";

// Define the path to your finalArray.json file
const filePath = path.resolve("./finalArray.json");

// Read the original data from finalArray.json
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Check if data is an array
if (!Array.isArray(data)) {
    console.error("Data is not an array. Please check the JSON structure.");
    process.exit(1); // Exit the process if data is not an array
}

// Update the incorrect category name
data.forEach(product => {
    if (product.category === 'Breakast & Instant Food') {
        product.category = 'Breakfast & Instant Food'; // Correct the category name
    }
});

// Log the products after the update
console.log("Products after update:", data);

// Write the updated products back to finalArray.json
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

console.log("Updated products written back to finalArray.json");



// const subcategory = await subCategories.find(subCategory => subCategory.name === "Dessert & Cake Mixes");
// // Find a product by name
// if(subcategory){
//     console.log("Subcategory found:", subcategory);
// }else{
//     console.log("Subcategory not found.");
// }





// const productName = "MTR Gulab Jamun Dessert Mix";
// const foundProduct = products.find(product => product.name === productName);

// if (foundProduct) {
//     console.log("Product found:", foundProduct);
// } else {
//     console.log("Product not found.");
// }




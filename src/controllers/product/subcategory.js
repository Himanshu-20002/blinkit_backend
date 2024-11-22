import Subcategory from "../../models/subcategory.js";

export const getAllSubcategories = async (req, reply) => {
    try {
        const subcategories = await Subcategory.find();
        return reply.send(subcategories);
    } catch (error) {
        return reply.code(500).send({ message: "Internal server error", error: error.message });
    }
};

//Experimentinal feature
// export const createSubcategory = async (req, reply) => {
//     try {
//         const newSubcategory = new Subcategory(req.body);
//         await newSubcategory.save();
//         return reply.code(201).send(newSubcategory);
//     } catch (error) {
//         return reply.code(400).send({ message: "Error creating subcategory", error: error.message });
//     }
// };

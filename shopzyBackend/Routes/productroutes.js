const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Products=require("../Models/Product")
const{auth,admin}=require("../middleware/Middleware")
require("dotenv").config();

const generateSKU = (name) => {
    const prefix = name.substring(0, 3).toUpperCase(); 
    const randomNum = Math.floor(1000 + Math.random() * 9000); 
    return `${prefix}-${randomNum}`;
};
router.post("/create-product",auth,admin,async(req,res)=>{
    const {name,description,category,image,price,stock,sellername,warehouse}=req.body
try{
const skuid=generateSKU(name);

const newProduct= new Products({
    name,
    description,
    category,
    image,
    price,
    stock,
    sellername,
    warehouse,
    skuid,
});
await newProduct.save();
res.status(201).json({ message: "Product created successfully", product: newProduct });
}
catch (error) {
    res.status(500).json({ message: "Error creating product", error });
}

})
router.get("/products",async(req,res)=>{
    try{

        const products=await Products.find();

        if(!products){
            return res(400).json({message:"No products available"})
        }
        res.status(200).json(products);
    }
    catch(error){
        res.status(500).json({message:"something went wrong",error:error.message})

    }
})
router.get("/category", async (req, res) => {
    const { category, price_lte, price_gte } = req.query;

    try {
        const filter = {};

        if (category) {
            filter.category = new RegExp(category, "i"); // Case-insensitive search
        }
        if (price_lte || price_gte) {
            filter.price = {};
            if (price_lte) filter.price.$lte = Number(price_lte);
            if (price_gte) filter.price.$gte = Number(price_gte);
        }

        const products = await Products.find(filter); // Corrected here

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});


router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort = 'price', order = 'asc' } = req.query;
    const filter = {};
    const sortOrder = order === 'desc' ? -1 : 1;

    try {
        const products = await Products.find(filter)
            .sort({ [sort]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        if (!products) {
            return res.status(400).json({ message: "No products available" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});
router.put("/update-product/:id", auth, admin, async (req, res) => {
    const { name, description, category, image, price, stock, sellername, warehouse } = req.body;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, category, image, price, stock, sellername, warehouse } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});

router.delete("/delete-product/:id", auth, admin, async (req, res) => {
    try {
        const deletedProduct = await Products.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});
router.get("/seller/:sellername", async (req, res) => {
    const { sellername } = req.params;
    try {
        const products = await Products.find({ sellername });

        if (!products) {
            return res.status(404).json({ message: "No products found for this seller" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});
// Add a review to a product
router.post("/product/:id/review", auth, async (req, res) => {
    const { userId, rating, comment } = req.body;
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = { userId, rating, comment };
        product.reviews.push(review);

        await product.save();
        res.status(201).json({ message: "Review added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});


module.exports = router;
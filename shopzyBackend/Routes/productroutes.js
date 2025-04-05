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
router.get("/category",async(req,res)=>{
    const {category,price_lte,price_gte}=req.query ;
    try{
        const filter={};

        if(category){
            filter.category = new RegExp(category, "i");

        }
        if (price_lte || price_gte) {
            filter.price = {};  
            if (price_lte) filter.price.$lte = Number(price_lte);  
            if (price_gte) filter.price.$gte = Number(price_gte);
        }
        const products = await Product.find(filter);
        console.log("Filter:", filter);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.status(200).json(products)
    }catch(error){
        res.status(500).json({message:"something went wrong",error:error.message})
    }
})
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});
module.exports = router;
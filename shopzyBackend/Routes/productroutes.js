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
module.exports = router;
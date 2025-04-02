const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Products=require("../Models/Product")
const{auth,admin}=require("../middleware/Middleware")
require("dotenv").config();

router.post("/products",admin,async(req,res)=>{
    

})
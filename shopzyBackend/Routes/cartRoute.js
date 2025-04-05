const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cart=require("../Models/Cart")
const{auth,admin}=require("../middleware/Middleware")
require("dotenv").config();

router.post("/createcart",auth,async(req,res)=>{

    const cart=new Cart(req.body);

    try{
        const savedCart = await cart.save();
        res.status(201).json(savedCart);

    }
catch(error){
    res.status(400).json({message:"Servererror",error:error.message})
}
})
router.put("/:id",auth , async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete("/:id", auth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/find/:userId", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/", admin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;
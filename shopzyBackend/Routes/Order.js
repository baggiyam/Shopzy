const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const order=require("../Models/OrderModel")
const{auth,admin}=require("../middleware/Middleware")
require("dotenv").config();

router.post("/create-order", auth, async (req, res) => {
    const { cartItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    
    try {
        // Get the user from the request object (auth middleware will ensure user is logged in)
        const userId = req.user._id;
        
        const orderItems = await Promise.all(
            cartItems.map(async (cartItem) => {
                const product = await Product.findById(cartItem.productId);
                return {
                    product: product._id,
                    name: product.name,
                    quantity: cartItem.quantity,
                    price: product.price,
                    image: product.image,
                };
            })
        );

        const newOrder = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            status: "Pending",
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
});


router.get("/orders/:userId", auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

router.get("/orders", auth, admin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

router.put("/update-order/:id", auth, admin, async (req, res) => {
    const { status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
});

router.delete("/delete-order/:id", auth, admin, async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
});
module.exports = router;
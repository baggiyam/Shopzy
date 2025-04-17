const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Products = require("../Models/Product");
const { auth, admin } = require("../middleware/Middleware");
require("dotenv").config();

// SKU Generator
const generateSKU = (name) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
};

// Create Product
router.post("/create-product", auth, admin, async (req, res) => {
    const { name, description, category, image, price, stock, sellername, warehouse, isFeatured } = req.body;
    try {
        const skuid = generateSKU(name);

        const newProduct = new Products({
            name,
            description,
            category,
            image,
            price,
            stock,
            sellername,
            warehouse,
            skuid,
            isFeatured: isFeatured || false,
            views: 0,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
});

// Get All Products with Pagination, Sorting
router.get("/products", async (req, res) => {
    const { page = 1, limit = 10, sort = 'price', order = 'asc' } = req.query;
    const sortOrder = order === 'desc' ? -1 : 1;

    try {
        const products = await Products.find()
            .sort({ [sort]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Get Single Product & Increment Views
router.get("/:id", async (req, res) => {
    try {
        const product = await Products.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});

// Filter by Category and Price
router.get("/category", async (req, res) => {
    const { category, price_lte, price_gte } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, "i");
    if (price_lte || price_gte) {
        filter.price = {};
        if (price_lte) filter.price.$lte = Number(price_lte);
        if (price_gte) filter.price.$gte = Number(price_gte);
    }

    try {
        const products = await Products.find(filter);
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

// Featured Products
router.get("/featured", async (req, res) => {
    try {
        const featured = await Products.find({ isFeatured: true }).limit(10);
        res.status(200).json(featured);
    } catch (error) {
        res.status(500).json({ message: "Error fetching featured products", error: error.message });
    }
});


router.get("/new", async (req, res) => {
    try {
        const newArrivals = await Products.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(newArrivals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching new arrivals", error: error.message });
    }
});

// Trending Products (sorted by views)
router.get("/trending", async (req, res) => {
    try {
        const trending = await Products.find().sort({ views: -1 }).limit(10);
        res.status(200).json(trending);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending products", error: error.message });
    }
});

// Search Products
router.get("/search", async (req, res) => {
    const { q } = req.query;
    try {
        const results = await Products.find({
            $or: [
                { name: new RegExp(q, "i") },
                { description: new RegExp(q, "i") }
            ]
        });

        if (!results.length) {
            return res.status(404).json({ message: "No matching products found" });
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message });
    }
});

// Update Product
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

// Delete Product
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

// Products by Seller
router.get("/seller/:sellername", async (req, res) => {
    try {
        const products = await Products.find({ sellername: req.params.sellername });
        if (!products.length) {
            return res.status(404).json({ message: "No products found for this seller" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching seller's products", error: error.message });
    }
});

// Add Product Review
router.post("/:id/review", auth, async (req, res) => {
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

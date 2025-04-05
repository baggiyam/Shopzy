const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const reveiw=require("../Models/Reveiw")
const{auth,admin}=require("../middleware/Middleware")
require("dotenv").config();


// POST a new review for a product
router.post("/reviews/:productId", auth, async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Check if the product exists
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already reviewed the product
        const existingReview = await Review.findOne({ userId, productId: req.params.productId });
        if (existingReview) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        // Create new review
        const newReview = new Review({
            userId,
            productId: req.params.productId,
            rating,
            comment,
        });

        await newReview.save();

        const reviews = await Review.find({ productId: req.params.productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(req.params.productId, {
            rating: avgRating,
            numReviews: reviews.length,
        });

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

// GET all reviews for a specific product
router.get("/reviews/:productId", async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name'); // Populate user info (name)
        
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
});


// PUT update a review
router.put("/reviews/:reviewId", auth, async (req, res) => {
    const { rating, comment } = req.body;
    try {
        // Find the review by ID
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Ensure the user is the one who wrote the review
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only edit your own reviews" });
        }

        // Update the review
        review.rating = rating;
        review.comment = comment;

        await review.save();

        // Recalculate product's average rating (optional)
        const reviews = await Review.find({ productId: review.productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(review.productId, {
            rating: avgRating,
        });

        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error: error.message });
    }
});


router.delete("/reviews/:reviewId", auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

    
        if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "You can only delete your own reviews" });
        }

  
        await review.remove();

        const reviews = await Review.find({ productId: review.productId });
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await Product.findByIdAndUpdate(review.productId, {
            rating: avgRating,
            numReviews: reviews.length,
        });

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
});
module.exports = router;
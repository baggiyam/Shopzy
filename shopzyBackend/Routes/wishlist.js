const express = require("express");
const router = express.Router();
const Wishlist = require('../Models/wishlist');
const { auth } = require('../middleware/Middleware');




router.post('/add', auth, async (req, res) => {
    const { productId } = req.body;
  
    try {
      let wishlist = await Wishlist.findOne({ userId: req.user._id });
      if (!wishlist) {
        wishlist = new Wishlist({ userId: req.user._id, items: [] });
      }
  
      if (!wishlist.items.find(item => item.productId.toString() === productId)) {
        wishlist.items.push({ productId });
      }
  
      await wishlist.save();
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
  });
  router.delete('/remove/:productId', auth, async (req, res) => {
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { items: { productId: req.params.productId } } },
        { new: true }
      );
  
      res.status(200).json(wishlist);
    } catch (error) {
      res.status(500).json({ message: "Error removing from wishlist", error: error.message });
    }
  });
  router.get('/', auth, async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('items.productId');
      res.status(200).json(wishlist || { items: [] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
  });
  
  module.exports = router;
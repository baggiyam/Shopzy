const express = require("express");
const router = express.Router();
const Cart = require('../Models/Cart');
const { auth } = require('../middleware/Middleware');

router.post('/add', auth, async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const index = cart.items.findIndex(item => item.productId.toString() === productId);
  
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
  
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
  });

  router.delete('/remove/:productId', auth, async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { items: { productId: req.params.productId } } },
        { new: true }
      );
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error removing item", error: error.message });
    }
  });
  router.get('/', auth, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user._id })
        .populate({
          path: 'items.productId',
          select: 'name price image description'  
        });
  
      res.status(200).json(cart || { items: [] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
  });

module.exports = router;

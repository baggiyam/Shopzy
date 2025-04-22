const express = require("express");
const router = express.Router();
const Cart = require('../Models/Cart');
const Order = require('../Models/order'); 
const { auth } = require('../middleware/Middleware');

router.post('/add', auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user._id;

  try {
    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if product is out of stock
    if (product.stock === 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart, create a new one
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product already exists in the cart
    const index = cart.items.findIndex(item => item.productId.toString() === productId);

    if (index > -1) {
      // If the item exists, update the quantity
      const existingQty = cart.items[index].quantity;
      const newTotalQty = existingQty + quantity;

      // Prevent exceeding available stock
      if (newTotalQty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock - existingQty} more available in stock`,
        });
      }

      // Update the quantity
      cart.items[index].quantity = newTotalQty;
    } else {
      // If the item does not exist in the cart, add it
      if (quantity > product.stock) {
        return res.status(400).json({ message: `Only ${product.stock} in stock` });
      }

      // Add the item with product details (price, image, description)
      cart.items.push({
        productId,
        quantity,
        price: product.price,         // Add the price
        image: product.image,         // Add the image
        description: product.description // Add the description
      });
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart); // Respond with the updated cart
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
  router.post('/checkout', auth, async (req, res) => {
    const userId = req.user._id;
  
    try {
      // Find the user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      // If cart is empty
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
      }
  
      // Loop through the cart items to check stock availability
      for (let item of cart.items) {
        const product = item.productId;
        if (item.quantity > product.stock) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}. Only ${product.stock} available.`,
          });
        }
      }
  
      // Proceed with stock deduction and create an order (optional)
      for (let item of cart.items) {
        const product = item.productId;
        product.stock -= item.quantity; // Deduct the stock
        await product.save(); // Save the updated product stock
      }
  
      // Create the order (you may want to adjust this based on your system)
      const newOrder = new Order({
        userId,
        items: cart.items,
        total: cart.items.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0), // Calculate total price
        status: "Pending", // Set initial order status
      });
  
      await newOrder.save(); // Save the new order
  
      // Optionally, clear the cart after checkout (if you don't want to keep the items in the cart)
      await Cart.findOneAndDelete({ userId });
  
      res.status(200).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Error during checkout", error: error.message });
    }
  });
module.exports = router;

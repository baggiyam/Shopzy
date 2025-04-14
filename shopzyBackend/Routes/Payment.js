const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Assuming you're using Stripe
const Order = require("../Models/OrderModel");

const router = express.Router();

router.post("/payment", async (req, res) => {
    const { orderId } = req.body;
  
    try {
      
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
 
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.totalPrice * 100,
        currency: "usd", 
        metadata: { orderId: order._id.toString() },
      });
  
      res.status(200).json({
        clientSecret: paymentIntent.client_secret, // Send client secret to client
        orderId: order._id, // Send order ID
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent", error: error.message });
    }
  });
  

  

rrouter.post("/payment/confirm", async (req, res) => {
    const { orderId, paymentIntentId } = req.body;
  
    try {
      // Retrieve the order to ensure it exists
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Confirm the payment using Stripe's API
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
      if (paymentIntent.status === "succeeded") {
        // Update order with payment information
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: paymentIntent.created,
          email_address: paymentIntent.charges.data[0].billing_details.email,
        };
        order.status = "Processing"; // Change status to 'Processing' or any relevant status
  
        // Save updated order
        await order.save();
  
        res.status(200).json({
          message: "Payment confirmed and order updated successfully",
          order,
        });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error confirming payment", error: error.message });
    }
  });
  
module.exports = router;

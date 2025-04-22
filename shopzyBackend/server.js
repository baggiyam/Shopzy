const express=require ("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
dotenv.config();
//ping to the database
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cron = require("node-cron");

// Ping your own Render URL every 14 minutes
cron.schedule("*/14 * * * *", () => {
  fetch("https://your-backend-name.onrender.com/ping")
    .then(res => console.log(`Pinged at ${new Date().toLocaleTimeString()}`))
    .catch(err => console.error("Ping failed:", err));
});
//Routes import
const authroutes= require("./Routes/authroutes");
const productroutes = require("./Routes/productroutes");
const cartRoute=require("./Routes/cart")
const wishlistRoute=require("./Routes/wishlist")
const app=express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});
//signup
app.use("/api",authroutes)
//product Routes
app.use("/product",productroutes)
//cart Routes
app.use("/cart",cartRoute)
app.use("/wishlist",wishlistRoute)
app.get("/ping", (req, res) => {
    res.status(200).send("pong");
  });
  

mongoose.connect(process.env.MONGO_URI,{
  
})
.then(()=>{
    console.log("connected to DB")
})
.catch((error) => console.log(error));
app.get("/",(req, res)=>{
    res.send("Ecommerce API is running...");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
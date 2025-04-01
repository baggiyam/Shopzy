const express=require ("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
dotenv.config();

//Routes import
const authroutes= require("./Routes/authroutes");

const app=express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});
//signup
app.use("/api",authroutes)

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
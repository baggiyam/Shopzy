const express=require ("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
dotenv.config();

const app=express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("connected to DB")
})
.catch((error) => console.log(err));
app.get("./",(req, res)=>{
    res.send("Ecommerce API is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const Products=new Schema({

  
    skuid:{
type:string,
required:true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    stock:{
        type: String,
        required: true,
        default: 0
    },
    warehouse:{
        type: String,
        required: true
    },
    ratings:{
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, required: true },
            comment: { type: String }
        }
    ]

},{timestamps:true})
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
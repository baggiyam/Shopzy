const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const productSchema = new Schema({


    skuid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true,
        default: 0
    },
    sellername: {

        type: String,
        required: true

    },
    warehouse: {
        type: String,
        required: true
    },
    ratings: {
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

}, { timestamps: true })
const Products = mongoose.model("Products", productSchema);
module.exports = Products;
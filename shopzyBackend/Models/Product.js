const mongoose = require("mongoose");
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
        type: Number,
        required: true
      },
      stock: {
        type: Number,
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
    ],
    views: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
      },
      isNew: {
        type: Boolean,
        default: false
      },
      brand: {
        type: String
      },
      discount: {
        type: Number, // % off
        default: 0
      },
      tags: [{
        type: String
      }],
      
}, { timestamps: true });

const Products = mongoose.model("Products", productSchema);
module.exports = Products;

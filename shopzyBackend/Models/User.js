const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
  
},  
{timestamps: true}
)

const User=mongoose.model("user",userSchema);
module.export=User;
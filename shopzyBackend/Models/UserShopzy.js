const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
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
  verificationToken: {
    type: Number
  },
  verificationTokenExpiration: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetVerificationToken: {
    type: Number
  },
  userStatus: {
    type: String,
    enum: ["New", "Premium", "VIP"],
    default: "New"
  }
}, { timestamps: true });

const UserShopzy = mongoose.model("User", userSchema);

module.exports = UserShopzy;

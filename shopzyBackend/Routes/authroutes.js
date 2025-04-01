const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const router=express.Router();
const nodemailer = require("nodemailer");
const User=require("../Models/User")
require("dotenv").config(); 


//Transporter implementation for Sending Mail for signup verification

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,  
        pass: process.env.ADMIN_EMAIL_PASSWORD,  
      },
});

router.post("/signup",async(req,res)=>{
    const{username, email, password}=req.body;

    try{
const existinguser= await User.findOne({email});

if(existinguser){
   return  res.status(400).json({message:"user alredy exist!"});
}
const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt)

const verificationToken=Math.floor(100000+Math.random()*9000)
const verificationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

const newUser=new User({
    username,
    email,
    password:hashedPassword,
    verificationToken,
    verificationTokenExpiration,
    isVerified:false,
});
await newUser.save();

const mailoptions={

    from:`"shopzy Team" <${process.env.ADMIN_EMAIL}>`,
    to:email,
    subject:"Email Verification",
    text:`Hello ${username},\n\n welcome to Shopzy, Please enter the verification code on you signuppage To verify your account . Please note this code will be valid for 24hrs \n\nBest Regards,\nshopzyTeam`,
    replyTo: process.env.ADMIN_EMAIL,
};
try{
const info=await transporter.sendMail(mailoptions);
console.log("Verification email sent:", info.response);
res.status(200).json({message:"Signup successful! please check your email for verification code."})
    
}
catch(emailerror){
    res.status(401).json({message:"failedtosendemailverification"})

}
    }
    catch(routeError){
        res.status(500).json({ message: "Server error during signup", error: error.message });

    }
})

module.exports = router;
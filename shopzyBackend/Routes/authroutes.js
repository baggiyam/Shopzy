const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../Models/UserShopzy")
require("dotenv").config();


//Transporter implementation for Sending Mail for signup verification

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existinguser = await User.findOne({ email });

        if (existinguser) {
            return res.status(400).json({ message: "user alredy exist!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const verificationToken = Math.floor(100000 + Math.random() * 9000)
        const verificationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiration,
            isVerified: false,
        });
        await newUser.save();

        const mailoptions = {

            from: `"shopzy Team" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Email Verification",
            text: `Hello ${username},\n\n welcome to Shopzy, Please enter the verification code on you signuppage To verify your account . Please note this code will be valid for 24hrs\n\n ${verificationToken}. \n\nBest Regards,\nshopzyTeam`,
            replyTo: process.env.ADMIN_EMAIL,
        };
        try {
            const info = await transporter.sendMail(mailoptions);
            console.log("Verification email sent:", info.response);
            res.status(200).json({ message: "Signup successful! please check your email for verification code." })

        }
        catch (emailerror) {
            res.status(401).json({ message: "failedtosendemailverification" })

        }
    }
    catch (routeerror) {
        res.status(500).json({ message: "Server error during signup", error: error.message });

    }
})
//codeverification
router.post("/verification", async (req, res) => {
    const { email, verificationCode } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "The user is not yet registered. please signup first" })
        }
        if (user.verificationToken !== Number(verificationCode)) {
            return res.status(401).json({ message: "invalid Verification Token" })
        }
        if (user.verificationTokenExpiration < Date.now()) {
            return res.status(401).json({ message: "Code  Expired please generate a new Code " })
        }
        user.isVerified = true,
            user.verificationToken = null;
        user.verificationTokenExpiration = null;
        await user.save();
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );



        return res.status(200).json({
            message: "Verification Sucessfull", token: token
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }


})
//Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    const user = await User.findOne({ email })
    try {
        if (!user) {
            return res.status(401).json({ message: "user not yet registered" })
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return res.status(200).json({ message: "Login sucessful", token: token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }


})
router.post("/resend", async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "email not yet registered" })
        }
        const newCode = Math.floor(100000 + Math.random() * 900000);
        user.verificationToken = newCode;
        user.verificationTokenExpiration = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailoptions = {
            from: `"shopzy Team" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Email Verification",
            text: `Hello ${user.username},\n\n welcome to Shopzy, Please enter the verification code on you signuppage To verify your account . Please note this code will be valid for 24hrs\n\n ${newCode}. \n\nBest Regards,\nshopzyTeam`,
            replyTo: process.env.ADMIN_EMAIL,
        };

        const info = await transporter.sendMail(mailoptions);
        console.log("Verification email sent:", info.response);
        res.status(200).json({ message: "verification code send sucessfully to your email" })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!",error: error.message });
    }
})
router.post("/forgotpassword",async(req,res)=>{
    const {email}=req.body;
 try{
    const user=await User.findOne({email});
if(!user){
    return res.status(400).json({message:"user not found"})
}
const resetToken = Math.floor(100000 + Math.random() * 900000); 
    const expires = Date.now() + 15 * 60 * 1000; 

    user.verificationToken = resetToken;
    user.verificationTokenExpiration=expires;
   
    await user.save();
    const mailOptions = {
        from: `"shopzy Team" <${process.env.ADMIN_EMAIL}>`,
        to: email,
        subject: "Password Reset Request",
        text: `Hello ${user.username},\n\nYour password reset code is:\n\n${resetToken}\n\nThis code will expire in 15 minutes.`,
      };
      await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset code sent to your email." });
 }
catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error!", error:error.message});
  }
})

router.post("/resetpassword",async(req,res)=>{
    const{email, resetcode,newPassword}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        if(user.verificationToken!==Number(resetcode)){

        
            return res.status(400).json({message:"Invalid code"})
        }
        if (user.verificationTokenExpiration < Date.now()) {
            return res.status(400).json({ message: "Reset code expired!" });
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);

          user.password = hashedPassword;
          user.verificationToken = undefined;
          user.verificationTokenExpiration = undefined;
          await user.save();

    res.status(200).json({ message: "Password reset successful! You can now log in." });
    
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error!" });
      }
})
module.exports = router;
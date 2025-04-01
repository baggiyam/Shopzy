const express=require(express);
const bcrypt=require(bcrypt);
const jwt=require(jwt);
const mongoose=require(mongoose);
const router=express.Router();
const nodemailer=require(nodemailer);
require("dotenv").config(); 
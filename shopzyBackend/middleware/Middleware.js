const jwt = require('jsonwebtoken');
const User=require("../Models/User");
const { model } = require('mongoose');

const auth=async(req,res,next)=>{
    const token=req.header('Authorization')?.replace('Bearer ', '');
if(!token){
    return res.status(401).json({message:'No token, authorization denied'})
}
try{
    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
}
catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
}
};
const admin=(req,res,next)=>{
    if(req.user.role!==admin){
        return res.status(403).json({ message: 'User not and admin' });
    }
next();
}
module.exports={auth,admin}
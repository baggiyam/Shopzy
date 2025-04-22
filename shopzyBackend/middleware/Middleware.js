const jwt = require('jsonwebtoken');
const User=require("../Models/UserShopzy");
const { model } = require('mongoose');

const auth=async(req,res,next)=>{
    const token=req.header('Authorization')?.replace('Bearer ', '');
if(!token){
    return res.status(401).json({message:'No token, authorization denied'})
}
try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
   
    req.user = user;
    next();
}
catch (error) {
    res.status(401).json({ message: 'Invalid or expired token',error:error.message });
}
};
const admin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {  
        return res.status(403).json({ message: 'User is not an admin' });
    }
    next();
};
module.exports={auth,admin}
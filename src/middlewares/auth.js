const jwt=require("jsonwebtoken");
const UserSchema=require("../model/user.js");

const authMiddleware=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized: No token provided"});
        }
        const decoded=await jwt.verify(token,"DevTinder@123");
        const user=await UserSchema.findById(decoded._id);
        if(!user){
            return res.status(401).json({message:"Unauthorized: User not found"});
        }
        req.user=user;
        next();
    }catch(err){
        return res.status(401).json({message:"Unauthorized: Invalid token"});
    }
};

module.exports=authMiddleware;
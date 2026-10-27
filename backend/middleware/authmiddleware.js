require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    try{
        const token = req.cookies?.token;

        if(!token){
            return res.status(400).json({message:"No token provided"});
        }

        const decode = jwt.verify( token , process.env.SECRET_CODE)
        req.user = decode;
        next();
    }catch(e){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
module.exports = authMiddleware;


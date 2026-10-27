const userModel = require("../models/users.js");
const bcryptjs = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");

const login = async (req,res)=> {
    try{
    const {email,password} = req.body;

    const checkUser = await userModel.findOne({email});

    if(!checkUser){
        return res.status(400).json({
            message:"User not found"
        });
    }

    const isMatch = await bcryptjs.compare(password,checkUser.password);

    if(!isMatch){
        return res.status(400).json({
            message:"Invalid password or email"
        });
    };

        const token = generateToken(
            checkUser._id,
            checkUser.role
        );
    res.cookie("token" , token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path:"/",
        maxAge:24*60*60*1000,
    });
    res.status(200).json({message:"User login successfull" , role:checkUser.role});

    
}catch(error){
    console.error("Login error:", error.message);
    res.status(400).json({
        message:error.message
    })
}
};


module.exports = login;

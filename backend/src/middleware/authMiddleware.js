const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const protectMiddleware = async(req,res,next)=>{
    try{
        //get token from the request header 
        const token = req.headers.authorization?.split(" ")[1];

        //if there is not token reject it
        if(!token){
            return res.status(401).json({
                message:"token is missing or token not found"
            });
        }
        let decoded;
        //jwt verify 
        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET);
        }catch(err){
            return res.status(401).json({
                message:"Invalid or expired token"
            })
        }
        //fetch from database
        //include everything except password
        const user = await userModel.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({
                message:"User not found"
            });
        }
        req.user = user;
        next();

    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }
}

module.exports = protectMiddleware;

// Token comes in → jwt.verify() unseals it and gives back decoded = { id: "..." } → we use that id to actually fetch the real user from the database → attach that real user onto req.user → now every route after this middleware has full access to who's making the request.

// After the token is verified, decoded gives me back the user's id that was stored inside the token at login. I use that id to fetch the real user from the database, and attach it to req.user — so every route after this middleware knows exactly who's making the request, without needing to re-verify anything
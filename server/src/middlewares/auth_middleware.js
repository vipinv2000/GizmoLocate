import jwt from 'jsonwebtoken'
import chalk from 'chalk'
import User from '../models/user_model.js'
import Shop from '../models/shop_model.js';


  export const RequestInfo = (req, res, next) => {
    console.log(chalk.bgGreen('Method:'), chalk.green(req.method));
    console.log(chalk.bgGreen('URL:'), chalk.green(req.url));
  
    next();
  };

export const UserPrivateRoute=async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorised-No token provided"})
        }
        const decoded=jwt.verify(token,"123456")

        if (!decoded){
            return res.status(401).json({message:"Unauthorised -Inavlid token"})
        
        }
        console.log(decoded);
        

        const user= await User.findOne({_id:decoded.id})
        if(!user){
            return res.status(401).json({message:"User not found"})
        }
        req.user=user
        next()
    } catch (e) {
        console.log("Error in UserPrivateRoute middleware: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const ShopPrivateRoute=async (req,res,next)=>{
    try {
       
        const token = req.cookies.jwt
        
        if(!token){
            return res.status(401).json({message:"Unauthorised-No token provided"})
        }
        const decoded=jwt.verify(token,"123456")

        if (!decoded){
            return res.status(401).json({message:"Unauthorised -Inavlid token"})
        
        }
        console.log(decoded);
        

        const shop= await Shop.findById(decoded.id)
        if(!shop){
            return res.status(401).json({message:"User not found"})
        }
        req.shop=shop
        next()
    } catch (e) {
        console.log("Error in shopPrivateRoute middleware: ", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
import Admin from "../models/admin_model.js";
import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import Shop from "../models/shop_model.js";
config()

export const login=async(req,res)=>{
    const {username,password}=req.body
    try {

        if ( !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
          }
      
          if (password.length < 6) {
            return res
              .status(400)
              .json({ message: 'Password must be at least 6 characters' });
          }
          const admin = await Admin.findOne({username:username,password:password})
          if(!admin){
            return  res.status(400).json({message: "no admin found", success:false})
          }
          const id=admin._id
           const token =  jwt.sign( {id} , process.env.JWT_SECRET, { expiresIn: '7d' });
           console.log((token));
           
           res.clearCookie()
            res.cookie('Admin_jwt', token, {
              maxAge: 7 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              samesite:"strict",
          
            });
          return res.status(200).json({AdminName:admin.username,success:true})

    } catch (e) {
        return res.status(500).json(e.messsage)
    }
}

export const listRequestedShop=async(req,res)=>{

try {
    const listshop= await Shop.find({isAccept:false})
    if(listshop.length==0){
        return res.status(400).json({success:false,message:"No incomming request"})
    }
    return res.status(200).json({listshop,success:true,message:null})
} catch (e) {
    return res.status(500).json(e.messsage)
}
}

export const logout=async(req,res)=>{}
export const acceptReq=async(req,res)=>{
      const {shopId}=req.params
      console.log(shopId);
      
    try {
     const shop = await Shop.findByIdAndUpdate({_id:shopId},{isAccept:true})
     return res.status(200).json({message:`Request from ${shop.shopname} is accepted`})
    } catch (e) {
        return res.status(500).json(e.messsage) 
    }
}
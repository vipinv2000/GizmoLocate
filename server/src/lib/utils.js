import jwt from 'jsonwebtoken';
import {config} from 'dotenv'  


config()

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    samesite:"strict",

  });

  return token
};

export const calculate_total_from_userCart= (cartItem)=>{
  
  

  try {

    if(cartItem.shopProduct.length===0){
      return res.status(400).json({message:"Now your cart is empty", success:false})
    }
    // total number of product price in each shop
    const subTotal= cartItem.shopProduct.map(item=>(
       item.products.reduce((acc,item2)=>(

       acc+(  item2.productId.price * item2.quantity)
       ),0)
    ))
   
    
    
    const TotalPrice= subTotal.reduce((acc,item3)=>{
      return acc+item3
    },0)
    console.log(TotalPrice);
    
     return TotalPrice
    
  } catch (e) {
    return res.status(500).json({message:"inernal server error"})
    
  }


}

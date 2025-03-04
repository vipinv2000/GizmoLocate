import jwt from 'jsonwebtoken';
import { config } from 'dotenv'
import Admin from '../models/admin_model.js';


config()

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    samesite: "None",
  });

  return token
};

export const calculate_total_from_userCart = (cartItem) => {

  try {

    if (cartItem.shopProduct.length === 0) {
      return { message: "Now your cart is empty" };
    }
    // total number of product price in each shop
    let no_of_carted_item = 0;

    const subTotal = cartItem.shopProduct.map(item => {
      no_of_carted_item += item.products.length
      return item.products.reduce((acc, item2) => (
        acc + (item2.productId.price * item2.quantity)
      ), 0);
    });

    console.log("No _Of Products cartedd:", no_of_carted_item);



    const TotalPrice = subTotal.reduce((acc, item3) => {
      return acc + item3
    }, 0)
    console.log(TotalPrice);

    let concatenatedProductName = ""; // Initialize as an empty string

    cartItem.shopProduct.forEach(item => {
      console.log(item);

      item.products.forEach(item2 => {
        concatenatedProductName += item2.productId.productname + ", ";
      });
    });

    const productname = concatenatedProductName.trim()


    return { TotalPrice, cartcount: no_of_carted_item, productname }

  } catch (e) {
    return { message: "inernal server error" };

  }


}

export const adminSignUp = async (req, res, next) => {
  console.log("Calling");


  const check = await Admin.find()
  console.log(check.length);


  if (check.length == 0) {
    const admin = await Admin.create({
      fullName: "Gizmolocate Admin",
      username: "admin",
      password: "123456"
    })
  }
  next()
}

import bcrypt from 'bcryptjs';
import Shop from '../models/shop_model.js';
import { generateToken } from '../lib/utils.js';
import Product from '../models/product_model.js';
import cloudinary from '../lib/cloudinary.js';
import Order from '../models/order_model.js';

export const signup = async (req, res) => {
  const { shopname, email, password } = req.body;
  try {
    if (!shopname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 3) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const shop = await Shop.findOne({ email });

    if (shop) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newShop = new Shop({
      ...req.body,
      shopname,
      email,
      password: hashedPassword,
    });

    if (newShop) {
      await newShop.save();

      res.status(201).json({
        _id: newShop._id,
        shopname: newShop.shopname,
        email: newShop.email,
        profilePic: newShop.profilePic,
      });
    } else {
      res.status(400).json({ message: 'Invalid Shop data' });
    }
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (shop.isAccept == false) {
      return res
        .status(400)
        .json({ message: 'wating for Approval', sucess: true });
    }

    const isPasswordCorrect = await bcrypt.compare(password, shop.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(shop._id, res);

    res.status(200).json({
      _id: shop._id,
      fullName: shop.fullName,
      email: shop.email,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const shop = await Product.create({
      ...req.body,
      // shopimage:imageUrl,
      shop: req.shop._id,
    });
    return res.status(201).json({ message: 'Product Added', sucess: true });
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const completeOrder = async (req, res) => {
  const shopId = req.shop._id;
  const { userId } = req.params;
  console.log(shopId, userId);

  try {
    const UserOrders = await Order.findOne({ user: userId })
      .populate('user', '-password')
      .populate('shopProduct.products.productId');

    const shopIndex = UserOrders.shopProduct.findIndex(
      item => item.shopId.toString() === shopId.toString()
    );

    const shopProducts = {
      user: UserOrders.user,
      products: UserOrders.shopProduct[shopIndex].products,
    };
     UserOrders.shopProduct[shopIndex].isDelivered=true

     await UserOrders.save()

    return res.status(200).json(shopProducts);
  } catch (e) {}
};



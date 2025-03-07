import bcrypt from 'bcryptjs';
import Shop from '../models/shop_model.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../lib/utils.js';
import Product from '../models/product_model.js';
import cloudinary from '../lib/cloudinary.js';
import Order from '../models/order_model.js';
import { userNotify } from '../lib/notification.js';
import { FaBoxOpen, FaShoppingCart, FaTruck } from "react-icons/fa";


export const signup = async (req, res) => {
  const {
    shopname,
    email,
    password,
    phonenumber,
    locationName,
    description,
    shopimage,
  } = req.body;
  console.log(req.body);

  try {
    if (
      !shopname ||
      !email ||
      !password ||
      !phonenumber ||
      !locationName ||
      !description
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const shop = await Shop.findOne({ email });

    if (shop) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let imageUrl;
    if (shopimage) {
      const uploadResponse = await cloudinary.uploader.upload(shopimage, {
        folder: 'profile_pics',
        resource_type: 'image',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newShop = new Shop({
      ...req.body,
      shopname,
      email,
      password: hashedPassword,
      shopname,
      email,
      password: hashedPassword,
      phonenumber,
      locationName,
      description,
      shopimage: imageUrl,
    });

    if (newShop) {
      await newShop.save();

      res.status(201).json({
        success: true,
        shop: {
          _id: newShop._id,
          shopname: newShop.shopname,
          email: newShop.email,
          profilePic: newShop.profilePic,
        },
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
        .json({ message: 'wating for Approval', success: true });
    }

    const isPasswordCorrect = await bcrypt.compare(password, shop.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const id = shop._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(token);

    res.clearCookie();
    res.cookie('shop_jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      samesite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'success',
      _shop: {
        id: shop._id,
        fullName: shop.fullName,
        email: shop.email,
      },
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

export const shopViewAuth = (req, res) => {
  try {
    const isShopAuth = req.shop;
    console.log(isShopAuth);

    return res.status(200).json({ Shop: isShopAuth, success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const addProduct = async (req, res) => {
  const {
    productname,
    category,
    productType,
    modelnumber,
    quantity,
    price,
    description,
    productimage,
  } = req.body;
  console.log(req.body);
  console.log('req.shop._id', req.shop._id);

  try {
    // Validate required fields
    if (!productname || !modelnumber || !quantity || !price || !category) {
      return res.status(400).json({
        message:
          'Product name, model number,category, quantity and price are required',
      });
    }

    let imageUrl;
    if (productimage) {
      const uploadResponse = await cloudinary.uploader.upload(productimage, {
        folder: 'product_images',
        resource_type: 'image',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newProduct = new Product({
      productname,
      category,
      productType,
      modelnumber,
      quantity,
      price,
      description,
      productimage: imageUrl,
      shop: req.shop._id,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    console.error('Error in addProduct controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const showProduct = async (req, res) => {
  const shopId = req.shop._id;
  try {
    const myShopProduct = await Product.find({ shop: shopId });

    if (!myShopProduct) {
      return res
        .status(400)
        .json({ success: false, message: 'No product for this shop' });
    }
    const Totalproducts = myShopProduct.length;
    return res
      .status(200)
      .json({ success: true, myShopProduct, Totalproducts });
  } catch (e) {
    console.error('Error in showProduct controller:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const pendingOrders = async (req, res) => {
  try {
    const shopId = req.shop._id;

    const orders = await Order.find({
      'shopProduct.shopId': shopId,
      'shopProduct.isDelivered': false,
    })
      .populate('user', 'fullName email')
      .populate(
        'shopProduct.products.productId',
        'productname price productimage'
      );

    if (!orders.length) {
      return res.json({
        shopId,
        totalUndeliveredOrders: 0,
        undeliveredOrders: [],
      });
    }

    const formattedOrders = orders.map(order => {
      if (!order.shopProduct || !Array.isArray(order.shopProduct)) {
        console.log('Invalid shopProduct structure for order:', order._id);
        return {
          orderId: order._id,
          user: order.user,
          products: [],
        };
      }

      const shopOrder = order.shopProduct.find(
        sp => sp.shopId.toString() === shopId.toString()
      );
      return {
        orderId: order._id,
        user: order.user,
        orderReady: order.shopProduct[0].orderReady,
        isDelivered:order.shopProduct[0].isDelivered,
        products: shopOrder
          ? shopOrder.products.map(p => ({
              _id: p._id,
              productId: p.productId._id,
              name: p.productId.productname,
              price: p.productId.price,
              image: p.productId.productimage,
              quantity: p.quantity,
              date: p.date,
            }))
          : [],
      };
    });

    res.json({
      shopId,
      totalUndeliveredOrders: formattedOrders.length,
      undeliveredOrders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching undelivered orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const fullfilledOrders = async (req, res) => {
  try {
    const shopId = req.shop._id;

    const orders = await Order.find({
      'shopProduct.shopId': shopId,
      'shopProduct.isDelivered': true,
    })
      .populate('user', 'fullName email')
      .populate(
        'shopProduct.products.productId',
        'productname price productimage'
      );

    if (!orders.length) {
      return res.json({
        shopId,
        totaldeliveredOrders: 0,
        deliveredOrders: [],
      });
    }

    const formattedOrders = orders.map(order => {
      if (!order.shopProduct || !Array.isArray(order.shopProduct)) {
        console.log('Invalid shopProduct structure for order:', order._id);
        return {
          orderId: order._id,
          user: order.user,
          products: [],
        };
      }

      const shopOrder = order.shopProduct.find(
        sp => sp.shopId.toString() === shopId.toString()
      );
      return {
        orderId: order._id,
        user: order.user,
        products: shopOrder
          ? shopOrder.products.map(p => ({
              _id: p._id,
              productId: p.productId._id,
              name: p.productId.productname,
              price: p.productId.price,
              image: p.productId.productimage,
              quantity: p.quantity,
              date: p.date,
            }))
          : [],
      };
    });

    res.json({
      shopId,
      totaldeliveredOrders: formattedOrders.length,
      deliveredOrders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const completeOrder = async (req, res) => {
  const shopId = req.shop._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('user', '-password')
      .populate('shopProduct.products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shopIndex = order.shopProduct.findIndex(
      item => item.shopId.toString() === shopId.toString()
    );

    if (shopIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Shop products not found in this order' });
    }

    order.shopProduct[shopIndex].isDelivered = true;

    await order.save();
    

    const shopProducts = {
      user: order.user,
      products: order.shopProduct[shopIndex].products,
      isDelivered: true,
    };
    const productNames =shopProducts.products.map(product => product.productId.productname).join(', ');
    
    userNotify( shopProducts.user._id,
      `Your order for ${productNames} has been delivered successfully! 🚚`,
      false)

    return res.status(200).json(shopProducts);
  } catch (e) {
    console.error('Error completing order:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const completeOrderReady = async (req, res) => {
  const shopId = req.shop._id;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('user', '-password')
      .populate('shopProduct.products.productId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shopIndex = order.shopProduct.findIndex(
      item => item.shopId.toString() === shopId.toString()
    );

    if (shopIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Shop products not found in this order' });
    }

    order.shopProduct[shopIndex].orderReady = true;

    await order.save();

    const shopProducts = {
      user: order.user,
      products: order.shopProduct[shopIndex].products,
      orderReady: true,
    };

    const productNames =shopProducts.products.map(product => product.productId.productname).join(', ');
    
    userNotify(shopProducts.user._id,
      `Your order for ${productNames} is ready for pickup! 📦`,
      false)

    return res.status(200).json(shopProducts);
  } catch (e) {
    console.error('Error completing order:', e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getShopRevenue = async (req, res) => {
  const shopId = req.shop._id;

  try {
    const orders = await Order.find({
      'shopProduct.shopId': shopId,
      'shopProduct.isDelivered': true,
    }).populate('shopProduct.products.productId', 'price');

    let totalRevenue = 0;

    orders.forEach(order => {
      const shopProductIndex = order.shopProduct.findIndex(
        item => item.shopId.toString() === shopId.toString() && item.isDelivered
      );

      if (
        shopProductIndex !== -1 &&
        order.shopProduct[shopProductIndex].products
      ) {
        order.shopProduct[shopProductIndex].products.forEach(product => {
          const price =
            product.price ||
            (product.productId && product.productId.price) ||
            0;
          const quantity = product.quantity || 1;

          totalRevenue += price * quantity;
        });
      }
    });

    return res.status(200).json({
      success: true,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate revenue',
    });
  }
};

// Shop Users Controller
export const getShopUsers = async (req, res) => {
  const shopId = req.shop._id;

  try {
    const orders = await Order.find({
      'shopProduct.shopId': shopId,
    })
      .populate('user', 'fullName email phone address createdAt')
      .populate('shopProduct.products.productId', 'price');

    const userMap = new Map();

    orders.forEach(order => {
      if (!order.user || !order.user._id) {
        return;
      }

      const userId = order.user._id.toString();
      const shopProductIndex = order.shopProduct.findIndex(
        item => item.shopId && item.shopId.toString() === shopId.toString()
      );

      if (
        shopProductIndex !== -1 &&
        order.shopProduct[shopProductIndex].products
      ) {
        let orderTotal = 0;

        order.shopProduct[shopProductIndex].products.forEach(product => {
          const price =
            product.price ||
            (product.productId && product.productId.price) ||
            0;
          const quantity = product.quantity || 1;

          orderTotal += price * quantity;
        });

        // If user already exists in map, update their data
        if (userMap.has(userId)) {
          const userData = userMap.get(userId);
          userMap.set(userId, {
            ...userData,
            orderCount: userData.orderCount + 1,
            totalSpent: userData.totalSpent + orderTotal,
          });
        } else {
          // Add new user to map
          userMap.set(userId, {
            _id: order.user._id,
            fullName: order.user.fullName,
            email: order.user.email,
            phone: order.user.phone,
            address: order.user.address,
            createdAt: order.user.createdAt,
            orderCount: 1,
            totalSpent: orderTotal,
          });
        }
      }
    });

    // Convert map to array
    const users = Array.from(userMap.values());

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching shop users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shop users',
    });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { price, quantity } = req.body;

  try {
    // Validate inputs
    if (!price || !quantity) {
      return res
        .status(400)
        .json({ message: 'Price and quantity are required' });
    }

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { price, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

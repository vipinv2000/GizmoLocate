import { generateToken } from '../lib/utils.js';
import Cart from '../models/cart_model.js';
import Product from '../models/product_model.js';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 3) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
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

export const addCart = async (req, res) => {
  const { productId, shopId, productName } = req.params;
  const userId = req.user._id;
  console.log(req.params, userId);

  try {
    const product = await Product.findById(productId).select("quantity");
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found', success: false });
    }
    if (product.quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'Product Out Of Stock', success: false });
    }

    const carted_item = {
      productId: productId,
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
    };

    let isCart = await Cart.findOne({ user: userId });

    if (isCart) {
      let shopIndex = isCart.shopProduct.findIndex(
        shop => shop.shopId.toString() === shopId
      );

      if (shopIndex !== -1) {
        let productIndex = isCart.shopProduct[shopIndex].products.findIndex(
          pro => pro.productId.toString() === productId
        );

        if (productIndex === -1) {
          isCart.shopProduct[shopIndex].products.push(carted_item);
        } else {
          isCart.shopProduct[shopIndex].products[productIndex].quantity += 1;
        }
      } else {
        isCart.shopProduct.push({
          shopId: shopId,
          products: [carted_item],
        });
      }
      product.quantity -= 1;
      await product.save();
      await isCart.save();
    } else {
      const rootCart = new Cart({
        user: userId,
        shopProduct: [
          {
            shopId: shopId,
            products: [carted_item],
          },
        ],
      });

      await rootCart.save();

      product.quantity -= 1;
      await product.save();
    }
    return res
      .status(201)
      .json({ message: `${productName} is added to your cart`, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const showCart = await Cart.findOne({ user: userId })
      .populate('shopProduct.shopId', 'shopname langitude longitude')
      .populate(
        'shopProduct.products.productId',
        'productname price productimage'
      );
    console.log(showCart);

    if (!showCart) {
      return res
        .status(404)
        .json({ message: 'Cart not found', success: false });
    }

    return res.status(200).json({ showCart, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const countChange = async (req, res) => {
  const userId = req.user._id;
  const { shopId, productId, quantityChange } = req.params;
  const increaseQuantity = quantityChange === 'true';

  try {
    let isCart = await Cart.findOne({ user: userId });
    if (!isCart) {
      return res
        .status(404)
        .json({ message: 'Cart not found', success: false });
    }

    let shopIndex = isCart.shopProduct.findIndex(
      shop => shop.shopId.toString() === shopId
    );
    if (shopIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Shop not found in cart', success: false });
    }

    let productIndex = isCart.shopProduct[shopIndex].products.findIndex(
      pro => pro.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Product not found in cart', success: false });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product not found', success: false });
    }

    if (increaseQuantity) {
      if (product.quantity <= 0) {
        return res
          .status(400)
          .json({ message: 'Product is out of stock', success: false });
      }
      isCart.shopProduct[shopIndex].products[productIndex].quantity += 1;
      product.quantity -= 1;
    } else {
      isCart.shopProduct[shopIndex].products[productIndex].quantity -= 1;
      product.quantity += 1;
      console.log(isCart.shopProduct[shopIndex].products[productIndex].quantity);
      if (isCart.shopProduct[shopIndex].products[productIndex].quantity === 0) {
        isCart.shopProduct[shopIndex].products.splice(productIndex, 1);
        if( isCart.shopProduct[shopIndex].products.length === 0){
        isCart.shopProduct.splice(shopIndex, 1);
          
        }
      }
    }

    await isCart.save();
    await product.save();

    return res
      .status(200)
      .json({ message: 'Cart updated successfully', success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

import cloudinary from '../lib/cloudinary.js';
import { formattedISTDateTime } from '../lib/indian_time.js';
import { calculate_total_from_userCart, generateToken } from '../lib/utils.js';
import Cart from '../models/cart_model.js';
import Order from '../models/order_model.js';
import Product from '../models/product_model.js';
import Shop from '../models/shop_model.js';
import User from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Wishlist from '../models/wishlIst_model.js';
import { userNotify } from '../lib/notification.js';
import Notify from '../models/notify_model.js';


dotenv.config();

export const signup = async (req, res) => {
  const { fullName, email, password, profilePic, locationName, phoneNumber } = req.body;
  try {
    if (!fullName || !email || !password || !locationName || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let imageUrl;
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: 'profile_pics',
        resource_type: 'image',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newUser = new User({
      fullName,
      email,
      locationName,
      phoneNumber,
      password: hashedPassword,
      profilePic: imageUrl,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        }
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
  console.log(req.body);
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
      success: true,
      message: 'success',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
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

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById controllerssss:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const addCart = async (req, res) => {
  const { productId, shopId, productName } = req.params;
  const userId = req.user._id;
  console.log(req.params, userId);

  try {
    const product = await Product.findById(productId).select('quantity');
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
  console.log(userId);


  try {
    const showCart = await Cart.findOne({ user: userId })
      .populate('shopProduct.shopId', 'shopname location phonenumber')
      .populate(
        'shopProduct.products.productId',
        'productname price productimage category productType modelnumber'
      );

    if (!showCart) {
      return res
        .status(404)
        .json({ message: 'Cart not found', success: false });
    }
    console.log("Car itemss", showCart);

    const { TotalPrice, cartcount, message } = calculate_total_from_userCart(showCart);

    if (message) {
      return res
        .status(400)
        .json({ message: message, sucess: false });
    }

    return res
      .status(200)
      .json({ showCart, total: TotalPrice, success: true, cartcount });
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
      console.log(
        isCart.shopProduct[shopIndex].products[productIndex].quantity
      );
      if (isCart.shopProduct[shopIndex].products[productIndex].quantity === 0) {
        isCart.shopProduct[shopIndex].products.splice(productIndex, 1);
        if (isCart.shopProduct[shopIndex].products.length === 0) {
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

export const userViewAuth = (req, res) => {
  try {
    const isAuth = req.user;
    console.log(isAuth);

    return res.status(201).json({ User: isAuth, success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server error', success: false });
  }
};

export const PlaceOrders = async (req, res) => {
  const userId = req.user._id;
  const { PaymentMode } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate([
      { path: 'shopProduct.shopId', select: 'shopname langitude longitude' },
      { path: 'shopProduct.products.productId', select: 'productname price productimage' }
    ]);

    if (!cart) {
      return res.status(404).json({ message: 'No cart found for this user', success: false });
    }

    const { TotalPrice, cartcount, productname } = calculate_total_from_userCart(cart);


    const order = new Order({
      totalPrice: TotalPrice,
      user: userId,
      shopProduct: cart.shopProduct,
      Datetime: formattedISTDateTime,
      Orderstatus: 'Pending',
      PaymentMethod: PaymentMode // Adding PaymentMode directly while placing the order
    });

    await order.save();

    userNotify(userId, `Your order for ${productname} has been successfully placed! We appreciate your trust in us. Wishing you a wonderful day! ✨`
      , true
    )

    await Cart.deleteOne({ user: userId });


    return res.status(200).json({ message: 'Order Placed', success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server Error' });
  }
};


export const AddWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
      return res.status(201).json({ message: 'Product added to wishlist' });
    } else if (wishlist.products.includes(productId)) {
      wishlist.products = wishlist.products.filter(
        item => item.toString() !== productId
      );
      await wishlist.save();
      return res.status(201).json({ message: 'Product remove from wishlist' });
    }
    else {
      await wishlist.save();
      res.status(400).json({ message: 'Product already in wishlist' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const RemoveWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      item => item.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ListWishlist = async (req, res) => {
  const userId = req.user._id
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    console.log("Wishhh", wishlist);


    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.status(200).json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



export const viewOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const viewOrders = await Order.find({ user: userId })
      .populate("shopProduct.shopId")
      .populate("shopProduct.products.productId");

    if (!viewOrders || viewOrders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found." });
    }

    console.log(viewOrders);

    return res.status(200).json({ success: true, isOrdered: viewOrders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const viewOrderHistory = async (req, res) => {
  const userId = req.user._id;
  try {
    const ViewOrders = await Order.findOne({ user: userId })
      .populate('shopProduct.shopId')
      .populate('shopProduct.products.productId');

    const isOrdered = ViewOrders.shopProduct.filter(item => {
      if (item.isDelivered === true) return item;
    });
    console.log(isOrdered);

    if (isOrdered.length == 0) {
      return res
        .status(404)
        .json({ message: 'No orders Found', success: false });
    }
    return res.status(200).json({ isOrdered, success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const fetchAllLocation = async (req, res) => {
  const { location } = req.query;
  console.log('Requested location:', location);

  try {
    // Fetch shops matching the query (Case-insensitive)
    const filteredShops = await Shop.find({
      locationName: { $regex: new RegExp(`^${location}`, 'i') },
    }); // ✅ Fetches all shop details

    // Extract unique location names (ignoring case & spaces)
    const uniqueLocations = [
      ...new Set(
        filteredShops.map(shop => shop.locationName.trim().toLowerCase())
      ),
    ];

    console.log('Filtered Shops:', filteredShops);
    console.log('Unique Locations:', uniqueLocations);

    res.json({
      success: true,
      locations: uniqueLocations, // ✅ Unique locations
      shops: filteredShops, // ✅ Full shop details
    });
  } catch (e) {
    console.error('Error fetching locations:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listProducts = async (req, res) => {
  const { shopId } = req.params;
  try {
    const products = await Product.find({ shop: shopId });
    return res.status(200).json({ products, success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listNearByLoc = async (req, res) => {
  const { lat, lng } = req.params; // User's location

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: 'Latitude and Longitude are required' });
  }
};

export const productSearch = async (req, res) => {
  const { searchkey } = req.params;
  const { locationName } = req.user;

  try {
    if (!searchkey) {
      return res.status(400).json({ error: true, message: "Search key is required" });
    }

    const regex = new RegExp(searchkey, 'i'); // Matches anywhere
    const regexStart = new RegExp(`^${searchkey}`, 'i'); // Matches words starting with searchkey

    // Fetch all matching products
    const AllProducts = await Product.find({
      $or: [
        { productType: { $regex: regex } },
        { productname: { $regex: regex } }
      ]
    }).populate("shop")

    const filteredProducts = AllProducts.filter(item => {
      console.log("Checking Shop:", item.shop.locationName, "Against User Location:", locationName);
      return item.shop?.locationName?.trim().toLowerCase() === locationName.trim().toLowerCase();
    });

    // Categorize products based on priority
    let priorityFirst = [];
    let prioritySecond = [];
    let priorityLast = [];

    filteredProducts.forEach((item) => {
      const nameMatchesStart = regexStart.test(item.productname);
      const typeMatchesStart = regexStart.test(item.productType);
      const nameMatches = regex.test(item.productname);
      const typeMatches = regex.test(item.productType);

      if (nameMatchesStart) {
        priorityFirst.push(item.productname);
      } else if (typeMatchesStart) {
        prioritySecond.push(item.productType);
      } else {
        if (nameMatches) priorityLast.push(item.productname);
        if (typeMatches) priorityLast.push(item.productType);
      }
    });

    // Remove duplicates & merge results
    const searchResult = [...new Set([...priorityFirst, ...prioritySecond, ...priorityLast])];

    console.log("✅ Prioritized Search Result:", searchResult);

    return res.status(200).json({ searchResult: searchResult, success: true }); // Return only the array

  } catch (e) {
    console.error("❌ Error in product search:", e);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
};


export const giveSearchResult = async (req, res) => {
  const { item } = req.params;
  try {
    const result = await Product.find({
      $or: [
        { productType: item },
        { productname: item }
      ]
    })

    console.log("Result", result);
    if (result.length === 0) {
      return res.status(500).json({ success: false, message: "Product Not found due to miss-match" });
    }

    return res.status(200).json({ success: true, result });

  } catch (e) {
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
}

export const deleteCart = async (req, res) => {
  const { shopId, productId } = req.params;
  const userId = req.user._id;

  try {
    const userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let shopIndex = userCart.shopProduct.findIndex(
      shop => shop.shopId.toString() === shopId
    );

    if (shopIndex === -1) {
      return res.status(404).json({ message: "Shop not found in cart" });
    }

    let productIndex = userCart.shopProduct[shopIndex].products.findIndex(
      pro => pro.productId.toString() === productId
    );


    console.log("Shop index", shopIndex, "ProductIndex", productIndex);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const cartQuantity = userCart.shopProduct[shopIndex].products[productIndex].quantity;

    await Product.updateOne(
      { _id: productId },
      { $inc: { quantity: cartQuantity } }
    );

    userCart.shopProduct[shopIndex].products.splice(productIndex, 1);

    if (userCart.shopProduct[shopIndex].products.length === 0) {
      userCart.shopProduct.splice(shopIndex, 1);
    }

    await userCart.save();

    res.status(200).json({ message: "Product removed from cart successfully", success: true });

  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  const userId = req.user._id;
  const { locationName } = req.user;

  try {
    const AllProducts = await Product.find().populate("shop")
    console.log("Apppple", AllProducts);


    if (AllProducts.length == 0) {
      return res.status(404).json({ message: "Product not found " });
    }

    const productslist = AllProducts.filter(item => {
      console.log("Checking Shop:", item.shop.locationName, "Against User Location:", locationName);
      return item.shop?.locationName?.trim().toLowerCase() === locationName.trim().toLowerCase();
    });

    const wishlist = await Wishlist.findOne({ user: userId });

    const products = wishlist ? wishlist.products : [];

    const wishedProducts = productslist.map(pro => ({
      ...pro.toObject(),
      wished: products.some(wishid => wishid.equals(pro._id))
    }));

    console.log(wishedProducts);

    res.status(200).json({ products: wishedProducts, success: true });

  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
}
export const getSingleproduct = async (req, res) => {
  const { proId } = req.params;
  try {
    const product = await Product.findOne({ _id: proId }).populate("shop")
    if (!product) {
      res.status(404).json({ message: "Product not Found", success: false })
    }
    res.status(200).json({ message: "Product Found", product, success: true })

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export const UpdateChooseLocation = async (req, res) => {
  console.log("Azad");

  const { location } = req.params;
  const userId = req.user._id;
  console.log(location);


  try {
    const update = await User.updateOne(
      { _id: userId },
      { $set: { locationName: location } }
    );

    if (update.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: `Now you location ${location}` });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCartCount = async (req, res) => {
  const userId = req.user._id;

  try {
    const showCart = await Cart.findOne({ user: userId })
      .populate('shopProduct.shopId', 'shopname location phonenumber')
      .populate(
        'shopProduct.products.productId',
        'productname price productimage category productType'
      );

    if (!showCart) {
      return res
        .status(404)
        .json({ message: 'Cart not found', success: false });
    }
    console.log("Car itemss", showCart);

    let no_of_carted_item = 0;

    showCart.shopProduct.map(item => {
      no_of_carted_item += item.products.length
    });

    return res
      .status(200)
      .json({ success: true, cartcount: no_of_carted_item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', success: false });
  }
}

export const getUserNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notify = await Notify.findOne({ userId: userId });
    if (notify) {
      return res.status(200).json({ success: true, Notifications: notify });
    }
    return res.status(200).json({ success: false });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', success: false });
  }
}

export const togglenotification = async (req, res) => {
  const userId = req.user._id;
  try {
    const notify = await Notify.findOne({ userId: userId });
    if (notify) {
      notify.isViewed = false;
      await notify.save()
      return res.status(200).json({ success: true, Notifications: notify });
    }
    return res.status(400).json({ success: false });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', success: false });
  }
}

export const recentOrder = async (req, res) => {
  const userId = req.user._id;
  try {
    // Find the last order for the specific user, sorted by _id (latest first)
    const lastOrder = await Order.findOne({ user: userId }).sort({ _id: -1 }).populate('shopProduct.shopId').populate('shopProduct.products.productId');

    if (!lastOrder) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    // Send the most recent order
    return res.status(200).json({ success: true, order: lastOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verfyUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, password } = req.body;
    const checkMail = await User.findOne({ email: email, _id: userId });
    if (!checkMail) {
      return res.status(400).json({ success: false, message: "Incorrect Mail Address or Account Miss match" });
    }

    const bcryptpassword = await bcrypt.compare(password, checkMail.password);
    if (!bcryptpassword) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
}

export const UpdateProfile = async (req, res) => {
  const userId = req.user._id;
  const { fullName, email, phoneNumber, password } = req.body;

  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existmail = await User.find({ email: email });

    if (user.email == email) {

    } else {
      if (existmail) {
        return res.status(404).json({ success: false, message: "This Mail addres Already exis" });
      }
    }


    // Create update object
    const updateFields = { fullName, email, phoneNumber };

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Update user in the database
    const upedProfile = await User.updateOne({ _id: userId }, { $set: updateFields });



    return res.status(200).json({ success: true, message: "Profile updated successfully", user });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




import express from 'express';
import {
  ShopPrivateRoute,
  UserPrivateRoute,
} from '../middlewares/auth_middleware.js';
import {
  login,
  logout,
  signup,
  addProduct,
  completeOrder,
  shopViewAuth,
  showProduct,
  pendingOrders,
  getShopRevenue,
  getShopUsers,
  fullfilledOrders,
  updateProduct,
  completeOrderReady,
} from '../controller/shopController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/shopviewauth', ShopPrivateRoute, shopViewAuth);
router.post('/add-product', ShopPrivateRoute, addProduct);
router.get('/showproduct', ShopPrivateRoute, showProduct);
router.get('/pendingOrders', ShopPrivateRoute, pendingOrders);
router.get('/fullfilledOrders', ShopPrivateRoute, fullfilledOrders);
router.get('/revenue', ShopPrivateRoute, getShopRevenue);
router.get('/users', ShopPrivateRoute, getShopUsers);
router.patch('/completeOrder/:orderId', ShopPrivateRoute, completeOrder);
router.patch('/completeOrderReady/:orderId', ShopPrivateRoute, completeOrderReady);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/add-product", ShopPrivateRoute, addProduct);
router.get("/completeOrder/:userId/:id", ShopPrivateRoute, completeOrder);
router.patch('/update-product/:productId', updateProduct)



export default router

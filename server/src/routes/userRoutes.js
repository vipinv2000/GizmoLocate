import express from 'express';
import { UserPrivateRoute } from '../middlewares/auth_middleware.js';
import {
  addCart,
  countChange,
  fetchAllLocation,
  gotoorders,
  listNearByLoc,
  listProducts,
  login,
  logout,
  placeOrder,
  signup,
  userViewAuth,
  viewCart,
  viewOrder,
  viewOrderHistory,
} from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', UserPrivateRoute, logout);
router.get(
  '/addCart/:productId/:shopId/:productName',
  UserPrivateRoute,
  addCart
);
router.get('/viewCart', UserPrivateRoute, viewCart);
router.get('/userViewAuth', UserPrivateRoute, userViewAuth);
router.get(
  '/countChange/:shopId/:productId/:quantityChange',
  UserPrivateRoute,
  countChange
);
router.get('/gotoorder', UserPrivateRoute, gotoorders);
router.get('/placeOrder/:PaymentMode', UserPrivateRoute, placeOrder);
router.get('/viewOrder', UserPrivateRoute, viewOrder);
router.get('/viewOrderHistory', UserPrivateRoute, viewOrderHistory);
router.get("/fetchAllLocation",UserPrivateRoute ,fetchAllLocation);
router.get("/listProducts/:shopId",UserPrivateRoute ,listProducts);
router.get("/listNearByLoc/:lat/:lng",UserPrivateRoute ,listNearByLoc);

export default router;

import express from 'express';
import { UserPrivateRoute } from '../middlewares/auth_middleware.js';
import {
  addCart,
  AddWishlist,
  countChange,
  fetchAllLocation,
  getUserById,
  listNearByLoc,
  listProducts,
  ListWishlist,
  login,
  logout,
  RemoveWishlist,
  signup,
  userViewAuth,
  viewCart,
  viewOrder,
  viewOrderHistory,
  productSearch,
  giveSearchResult,
  deleteCart,
  PlaceOrders,
  getProducts,
  getSingleproduct,
  UpdateChooseLocation,
  getCartCount,
  getUserNotifications,
  togglenotification,
  recentOrder
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
router.get("/fetchAllLocationforRegister", fetchAllLocation);

router.get('/viewCart', UserPrivateRoute, viewCart);
router.get('/userid', UserPrivateRoute, getUserById);
router.get('/userViewAuth', UserPrivateRoute, userViewAuth);
router.get(
  '/countChange/:shopId/:productId/:quantityChange',
  UserPrivateRoute,
  countChange
);
router.get('/deleteCart/:shopId/:productId', UserPrivateRoute, deleteCart)
router.get('/getCartCount', UserPrivateRoute, getCartCount)

router.get('/placeOrder/:PaymentMode', UserPrivateRoute, PlaceOrders);
router.get('/viewOrder', UserPrivateRoute, viewOrder);

router.get('/addwishlist/:productId', UserPrivateRoute, AddWishlist);
router.delete('/removewishlist/:productId', UserPrivateRoute, RemoveWishlist);
router.get('/mywishlist', UserPrivateRoute, ListWishlist);

router.get('/viewOrderHistory', UserPrivateRoute, viewOrderHistory);

router.get("/fetchAllLocation", UserPrivateRoute, fetchAllLocation);
router.get("/UpdateChooseLocation/:location", UserPrivateRoute, UpdateChooseLocation);

router.get("/listProducts/:shopId", UserPrivateRoute, listProducts);
router.get("/listNearByLoc/:lat/:lng", UserPrivateRoute, listNearByLoc);

router.get("/productSearch/:searchkey", UserPrivateRoute, productSearch)
router.get("/giveSearchResult/:item", UserPrivateRoute, giveSearchResult)

router.get('/getProdects', UserPrivateRoute, getProducts)
router.get('/getSingleproduct/:proId', UserPrivateRoute, getSingleproduct)

router.get('/getUserNotifications', UserPrivateRoute, getUserNotifications)
router.get('/togglenotification', UserPrivateRoute, togglenotification)

router.get('/recentOrder',UserPrivateRoute,recentOrder)

export default router;

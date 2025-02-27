import express from "express";
import  {ShopPrivateRoute, UserPrivateRoute} from '../middlewares/auth_middleware.js'
import { login, logout, signup,addProduct, completeOrder, shopViewAuth } from "../controller/shopController.js";


const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/shopviewauth", ShopPrivateRoute,shopViewAuth);
router.post("/add-product",ShopPrivateRoute ,addProduct);
router.get("/completeOrder/:userId",ShopPrivateRoute ,completeOrder);



export default router
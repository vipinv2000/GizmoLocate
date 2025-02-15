import express from "express";
import  {UserPrivateRoute} from '../middlewares/auth_middleware.js'
import { addCart, countChange, login, logout, signup, viewCart } from "../controller/userController.js";


const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",UserPrivateRoute, logout);
router.get("/addCart/:productId/:shopId/:productName",UserPrivateRoute, addCart);
router.get("/viewCart",UserPrivateRoute, viewCart);
router.get("/countChange/:shopId/:productId/:quantityChange",UserPrivateRoute, countChange);


export default router
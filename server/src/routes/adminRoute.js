import express from 'express';
import {
  acceptReq,
  listRequestedShop,
  login,
  logout,
  getAdminobject,
  ListShops,
  ListUsers
} from '../controller/adminControllers.js';
import { AdminPrivateRoute } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/adminAuth', AdminPrivateRoute, getAdminobject);
router.get('/listRequestedShop', AdminPrivateRoute, listRequestedShop);
router.get('/acceptReq/:shopId', AdminPrivateRoute, acceptReq);
router.get('/ListShops', AdminPrivateRoute,ListShops );
router.get('/ListUsers', AdminPrivateRoute,ListUsers );

export default router;

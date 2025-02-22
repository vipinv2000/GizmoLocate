import express from 'express';
import {
  acceptReq,
  listRequestedShop,
  login,
  logout,
} from '../controller/adminControllers.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/listRequestedShop', listRequestedShop);
router.get('/acceptReq/:shopId', acceptReq);

export default router;

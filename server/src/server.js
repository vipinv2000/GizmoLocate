import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ConnectDb } from './lib/db.js';
import { RequestInfo } from './middlewares/auth_middleware.js';
import userRoute from './routes/userRoutes.js';
import shopRoute from './routes/shopRoute.js';
import adminRoute from './routes/adminRoute.js'
import cors from 'cors';
import chalk from 'chalk';
import { adminSignUp } from './lib/utils.js';

//middlewares
const app = express();
const allowedOrigins = ['http://localhost:5173'];
dotenv.config();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(RequestInfo);
app.use(adminSignUp)
//Routes

app.use('/api/user', userRoute);
app.use('/api/shop', shopRoute);
app.use('/api/admin',adminRoute);

app.use('*', (req, res) => {
  console.log(chalk.red('404 Not Found Error'));
  return res.status(404).json({ error: true, message: 'No route found' });
});

app.listen(5001, () => {
  console.log('server is running');
  ConnectDb();
});

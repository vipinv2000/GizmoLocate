import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { ConnectDb } from './lib/db.js';
import { RequestInfo } from './middlewares/auth_middleware.js';
import userRoute from './routes/userRoutes.js';
import shopRoute from './routes/shopRoute.js'
import cors from 'cors'


//middlewares
const app = express();
const  allowedOrgins=['http://localhost:5173']
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(RequestInfo)
app.use(cors({origin:allowedOrgins,credentials:true}))

//Routes

app.use("/api/user", userRoute);
app.use("/api/shop",shopRoute)







app.use('*',(req,res)=>{
  console.log(chalk.red('404 Not Found Error'))
  return res.status(404).json({error:true,message:"No route found"})
})


app.listen(5001, () => {
  console.log('server is running');
  ConnectDb()
});

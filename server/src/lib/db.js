import mongoose from 'mongoose'
export const ConnectDb=async()=>{
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/mobile-shop')
        console.log('DB connected');
        
    } catch (e) {
        console.log(e);
        
    }
}
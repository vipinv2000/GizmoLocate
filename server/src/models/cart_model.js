import mongoose, { Schema } from 'mongoose';

const cartSchema = new mongoose.Schema({
 

  user: {
    type:Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  shopProduct:[{
    shopId:{
        type:Schema.Types.ObjectId,
        ref:"Shop",
        required:true,
    },
    products:[ {
        productId:{
            type:Schema.Types.ObjectId,
            required: true,
            ref:"Product",
        },
        quantity:{
            type:Number,
            required: true,
        },
        date:{
            type:String,
            required:true,
        }
      }],

  }]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

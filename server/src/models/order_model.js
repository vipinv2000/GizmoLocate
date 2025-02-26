import mongoose, { Schema } from 'mongoose';

const OrderSchema = new mongoose.Schema({
  totalPrice: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopProduct: [{
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    products: [{
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      }
    }],
  }],
  Datetime: {
    type: String,
    required: true
  },
  PaymentMethod: {  
    type: String,
    enum: ["cod", "online"],  // ✅ Restrict to "COD" or "Online"
    required: true
  },
  Orderstatus: {  
    type: String,
    default: "Pending"
  }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;

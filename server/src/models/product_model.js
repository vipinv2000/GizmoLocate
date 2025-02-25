import mongoose, { Schema } from 'mongoose';

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  productType: {
    type: String
  },
  modelnumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  productimage: {
    type: String // Store image URL or file path
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;

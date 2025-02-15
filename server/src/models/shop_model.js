import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  shopname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  langitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shopimage: {
    type: String,
    default: '',
  },
  isAccept: {
    type: Boolean,
    default: false,
  },
});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;

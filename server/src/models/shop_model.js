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
  locationName: {
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
  lat: {
    type: String,
    default: "37.7749",
  },
  lng: {
    type: String,
    default: "-122.4194",
  }
});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;

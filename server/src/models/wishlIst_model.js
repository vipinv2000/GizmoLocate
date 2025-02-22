import mongoose, { Schema } from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;

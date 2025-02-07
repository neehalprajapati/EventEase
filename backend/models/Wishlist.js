const mongoose = require('mongoose');


const wishlistSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Reference to the customer
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Reference to the service provider
    added_on: { type: Date, default: Date.now }, // Timestamp
  });
  
  const Wishlist = new mongoose.model('wishlist', wishlistSchema);

module.exports = Wishlist;

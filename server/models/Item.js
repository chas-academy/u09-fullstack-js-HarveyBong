const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   
  
  title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,  
      required: true,
    },
    image: {
      type: String,
      required: false, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  
  const Item = mongoose.model('Item', itemSchema);
  
  module.exports = Item;
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
      type: Number,  // Ensure that price is defined as a number
      required: true,
    },
    image: {
      type: String,
      required: false,  // Depending on whether you require this field
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Item = mongoose.model('Item', itemSchema);
  
  module.exports = Item;
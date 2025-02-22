// models/item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchased: { type: Boolean, default: false },
    category: { 
      type: String, 
      required: true, 
      enum: ['electronics', 'clothing', 'books', 'furniture'] 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
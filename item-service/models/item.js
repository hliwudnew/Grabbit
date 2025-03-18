// models/item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // Instead of referencing User, store an object with seller details:
    seller: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      username: { type: String, required: true }
    },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchased: { type: Boolean, default: false },
    category: { 
      type: String, 
      required: true, 
      enum: [
        'furniture', 
        'plants', 
        'tools', 
        'lighting', 
        'cleaning', 
        'bedroom', 
        'bathroom', 
        'kitchen', 
        'laptops', 
        'tablets', 
        'headphones', 
        'speakers', 
        'televisions', 
        'gaming consoles', 
        'video games', 
        'pc parts'
      ]
    },
    condition: { 
      type: String, 
      required: true, 
      enum: ['new', 'pre-owned'] 
    },
    delivery: { 
      type: String, 
      required: true, 
      enum: ['in-person', 'online', 'both'] 
    },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
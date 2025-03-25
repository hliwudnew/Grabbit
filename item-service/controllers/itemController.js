// controllers/itemController.js
const Item = require('../models/item');
const mongoose = require('mongoose');

// Create a new item listing with image upload
const createItem = async (req, res) => {
  try {
    const { title, description, price, category, condition, delivery } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build seller object from token data (using req.user.id)
    const seller = { 
      _id: req.user.id, 
      username: req.user.username || "DefaultName", 
      stripeAccountId: req.user.stripeAccountId
    };

    if (!seller.stripeAccountId) {
      return res.status(400).json({ message: 'Seller stripe account not set' });
    }

    const item = await Item.create({ 
      title, 
      description, 
      price, 
      category, 
      condition, 
      delivery, 
      seller, 
      imageUrl 
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get list of all available items (no filtering on seller)
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ purchased: false })
      .populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get details for a specific item
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'username email')
      .populate('buyer', 'username email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Purchase an item (direct purchase endpoint)
const purchaseItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.purchased) return res.status(400).json({ message: 'Item already purchased' });
    
    item.purchased = true;
    item.buyer = req.user._id;
    await item.save();
    res.json({ message: 'Item purchased successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active items listed by the seller (i.e. current user)
const getSellerItems = async (req, res) => {
  try {
    const items = await Item.find({ "seller._id": req.user.id, purchased: false })
      .populate('buyer', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get items purchased by the buyer (i.e. current user)
const getBuyerItems = async (req, res) => {
  try {
    const items = await Item.find({ buyer: req.user._id })
      .populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public search for items
const searchItems = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category } = req.query;
    let filter = { purchased: false };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) {
      filter.category = category;
    }
    const items = await Item.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark an item as sold (by the seller)
const markItemAsSold = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this item as sold.' });
    }
    if (item.purchased) return res.status(400).json({ message: 'Item is already marked as sold.' });
    
    item.purchased = true;
    await item.save();
    res.json({ message: 'Item marked as sold successfully.', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search for items not listed by the current user ("others" search)
const searchOtherItems = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category } = req.query;
    let filter = { purchased: false, "seller._id": { $ne: req.user.id } };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) {
      filter.category = category;
    }
    console.log("Filter for others search:", filter);
    const items = await Item.find(filter).populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get items not created by the current user (others) without additional filters
const getOtherItems = async (req, res) => {
  try {
    const items = await Item.find({ purchased: false, "seller._id": { $ne: req.user.id } })
      .populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get multiple items by IDs
const getMultipleItemsById = async (req, res) => {
  try {
    const items = await Item.find({ _id: { $in: req.body.itemIDs } });
    if (!items) {
      return res.status(404).json({ message: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Webhook endpoint: mark an item as purchased via webhook
const purchaseItemWebhook = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.purchased) return res.status(400).json({ message: 'Item already purchased' });
    
    item.purchased = true;
    await item.save();
    res.json({ message: 'Item marked as purchased via webhook', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Setup multer for file uploads
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  purchaseItem,
  getSellerItems,
  getBuyerItems,
  searchItems,
  markItemAsSold,
  searchOtherItems,
  getOtherItems,
  getMultipleItemsById,
  purchaseItemWebhook,
  upload,
};
// controllers/itemController.js
const Item = require('../models/item');
const mongoose = require('mongoose');

// controllers/itemController.js
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category, condition, delivery } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Ensure the request is authenticated (should have been checked by protect middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Build seller object from token data
    const seller = { 
      _id: req.user.id, 
      username: req.user.username || "DefaultName", 
      stripeAccountId: req.user.stripeAccountId  // Must be set in the token
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
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ purchased: false })
      .populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get details for a specific item
exports.getItemById = async (req, res) => {
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

// Get details for a multiple items
exports.getMultipleItemsById = async (req, res) => {
  try {
    const items = await Item.find({ _id: { $in: req.body.itemIDs } });

    if (!items){
      return res.status(404).json({ message: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Purchase an item
exports.purchaseItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.purchased) return res.status(400).json({ message: 'Item already purchased' });
    
    // Mark the item as purchased and record the buyer from the authenticated user
    item.purchased = true;
    item.buyer = req.user._id;
    await item.save();
    res.json({ message: 'Item purchased successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get items listed by the seller (i.e. current user) that are still active
exports.getSellerItems = async (req, res) => {
  try {
    // Use req.user.id (or req.user._id if you standardized it) and filter purchased: false
    const items = await Item.find({ "seller._id": req.user.id, purchased: false })
      .populate('buyer', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get items purchased by the buyer (i.e. current user)
exports.getBuyerItems = async (req, res) => {
  try {
    const items = await Item.find({ buyer: req.user._id })
      .populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public search for items
exports.searchItems = async (req, res) => {
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
exports.markItemAsSold = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    // Compare seller IDs (embedded seller is an object)
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
// Search for items not listed by the current user ("others" search)
exports.searchOtherItems = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category } = req.query;
    // Use req.user.id here
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
exports.getOtherItems = async (req, res) => {
  try {
    const items = await Item.find({
      purchased: false,
      "seller._id": { $ne: req.user.id }
    }).populate('seller', 'username email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});



exports.upload = multer({ storage, fileFilter });


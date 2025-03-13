// controllers/itemController.js
const Item = require('../models/item');

// Create a new item listing with image upload
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category, condition, delivery } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Embed seller info directly
    const seller = { _id: req.user._id, username: req.user.username || "DefaultName" };

    const item = await Item.create({ title, description, price, category, condition, delivery, seller, imageUrl });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get list of available items
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

// Purchase an item
exports.purchaseItem = async (req, res) => {
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

// Get items listed by the seller (i.e. current user)
exports.getSellerItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id })
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

// Search for items
exports.searchItems = async (req, res) => {
  try {
    // Get query parameters
    const { q, minPrice, maxPrice, category } = req.query;
    let filter = { purchased: false }; // Only search among available items

    // If a query (q) is provided, search in the title and/or description
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // If price filters are provided, add them
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // If category is provided, filter by category
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
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    // Ensure the authenticated user is the seller
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to mark this item as sold.' });
    }
    // If the item is already marked as sold, return an error
    if (item.purchased) {
      return res.status(400).json({ message: 'Item is already marked as sold.' });
    }
    
    // Mark the item as sold
    item.purchased = true;
    await item.save();

    res.json({ message: 'Item marked as sold successfully.', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const multer = require('multer');
const path = require('path');

// Configure storage - files will be stored in 'uploads/' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Ensure this directory exists in your project root
  },
  filename: function (req, file, cb) {
    // Create a unique filename using Date.now() + original extension
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// File filter to only allow images (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
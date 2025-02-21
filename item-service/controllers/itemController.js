// controllers/itemController.js
const Item = require('../models/item');

// Create a new item listing
exports.createItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const seller = req.user._id;
    const item = await Item.create({ title, description, price, seller });
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
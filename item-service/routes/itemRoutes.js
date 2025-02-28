// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  purchaseItem,
  getSellerItems,
  getBuyerItems,
  searchItems,
  markItemAsSold  // New function
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// New route for marking an item as sold
router.post('/:id/sold', protect, markItemAsSold);

// Existing routes (ensure static routes come before dynamic ones if needed)
router.get('/search', searchItems);
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', protect, createItem);
router.post('/:id/purchase', protect, purchaseItem);

module.exports = router;
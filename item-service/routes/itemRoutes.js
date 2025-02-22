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
  searchItems  
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// New search endpoint: GET /api/items/search
router.get('/search', searchItems);

// Existing public endpoints
router.get('/', getItems);
router.get('/:id', getItemById);

// Existing protected endpoints
router.post('/', protect, createItem);
router.post('/:id/purchase', protect, purchaseItem);
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);

module.exports = router;
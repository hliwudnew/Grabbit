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
  markItemAsSold,
  searchOtherItems,
  getOtherItems,
  upload
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// Create an item with image upload
router.post('/', protect, upload.single('image'), createItem);

// Public endpoints for search
router.get('/search', searchItems);

// Endpoints for the current user's items
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);

// Endpoints to fetch items not created by the current user
router.get('/others/search', protect, searchOtherItems);
router.get('/others', protect, getOtherItems);

// Base endpoint for all items (no filtering)
router.get('/', getItems);

// Parameterized route for getting a specific item by ID (must come after the specific routes)
router.get('/:id', getItemById);

// Endpoints for purchasing and marking as sold
router.post('/:id/purchase', protect, purchaseItem);
router.post('/:id/sold', protect, markItemAsSold);

module.exports = router;
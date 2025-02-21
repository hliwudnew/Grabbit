const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  purchaseItem,
  getSellerItems,
  getBuyerItems
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// Place static routes first
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);

// Then your general routes
router.get('/', getItems);
router.get('/:id', getItemById);

router.post('/', protect, createItem);
router.post('/:id/purchase', protect, purchaseItem);

module.exports = router;
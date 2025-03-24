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
  markItemAsSold,
  searchOtherItems,
  getOtherItems,
  getMultipleItemsById,
  purchaseItemWebhook,
  upload
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('image'), createItem);
router.get('/search', searchItems);
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);
router.get('/others/search', protect, searchOtherItems);
router.get('/others', protect, getOtherItems);
router.get('/', getItems);
router.get('/:id', getItemById);
router.post("/many", getMultipleItemsById);
router.post('/:id/purchase', protect, purchaseItem);
router.post('/:id/sold', protect, markItemAsSold);
router.post('/:id/webhookPurchase', purchaseItemWebhook);

module.exports = router;
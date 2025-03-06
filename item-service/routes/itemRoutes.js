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
  markItemAsSold
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer as above (or import it if configured elsewhere)
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
    cb(new Error("Not an image!"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// New route for creating an item with an image upload
router.post('/', protect, upload.single('image'), createItem);

// Other routes
router.get('/search', searchItems);
router.get('/seller/myitems', protect, getSellerItems);
router.get('/buyer/myitems', protect, getBuyerItems);
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/:id/purchase', protect, purchaseItem);
router.post('/:id/sold', protect, markItemAsSold);

module.exports = router;
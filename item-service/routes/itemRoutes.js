// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { createItem, getItems, getItemById, purchaseItem } = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// Public endpoints:
router.get('/', getItems);
router.get('/:id', getItemById);

// Protected endpoints:
router.post('/', protect, createItem);
router.post('/:id/purchase', protect, purchaseItem);

module.exports = router;
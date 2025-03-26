const express = require('express');
const router = express.Router();
//Pulled from controllers
const {getWatchList, addToWatchList, removeFromWatchList, createWatchList} = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

// // Endpoint to send a message (protected)
router.put('/add', protect, addToWatchList);
router.delete('/remove', protect, removeFromWatchList);
router.post('/create', protect, createWatchList);
router.get('/', protect, getWatchList);

module.exports = router;
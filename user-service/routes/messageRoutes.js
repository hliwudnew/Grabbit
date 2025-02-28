// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/messageController');
const { protect } = require('../../item-service/middleware/auth');

// Endpoint to send a message (protected)
router.post('/', protect, sendMessage);

// Endpoint to get a conversation with another user (protected)
// Example URL: /api/messages/RECEIVER_USER_ID
router.get('/:userId', protect, getConversation);

module.exports = router;
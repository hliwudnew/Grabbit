const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  addNotification,
  getNotifications
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

// Notification endpoints:
// Endpoint for external services (like your item service) to add a notification
router.post('/notifications', addNotification);

// Endpoint for an authenticated user to view their notifications
router.get('/notifications', protect, getNotifications);

module.exports = router;
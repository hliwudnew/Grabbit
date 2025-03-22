const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  addNotification,
  getNotifications,
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/change-password', protect, changePassword);  // Added route for changing password
router.post('/notifications', addNotification);
router.get('/notifications', protect, getNotifications);

module.exports = router;
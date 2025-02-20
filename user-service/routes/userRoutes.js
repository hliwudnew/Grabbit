// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected route
router.get('/profile', protect, getUserProfile);

module.exports = router;
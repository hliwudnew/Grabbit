// controllers/userController.js
require('dotenv').config(); 
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// Generate a JWT token that includes stripeAccountId
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      stripeAccountId: user.stripeAccountId  // include this field
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// controllers/userController.js
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    let user = await User.create({ username, email, password });

    // Create a Stripe Connect account for the seller (Express)
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email: email,
      capabilities: { transfers: { requested: true } },
      business_profile: { url: process.env.CLIENT_URL } // This URL must begin with http:// or https://
    });

    // Save the connected account ID on the user
    user.stripeAccountId = account.id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      stripeAccountId: user.stripeAccountId,
      token: generateToken(user)
    });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `Duplicate ${field} error. Please choose a different ${field}.` });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        stripeAccountId: user.stripeAccountId, // add this line
        token: generateToken(user)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Example: Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a notification for a user
exports.addNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: 'userId and message are required.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Push a new notification into the notifications array
    user.notifications.push({ message });
    await user.save();
    res.status(200).json({ message: 'Notification added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Change password for authenticated user
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required.' });
    }

    // Find the user based on the authenticated user's ID (set by auth middleware)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify the old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Update the user's password
    user.password = newPassword; // This will be hashed automatically by the pre-save hook
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

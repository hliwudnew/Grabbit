// controllers/messageController.js
const Message = require('../models/message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    // sender is taken from req.user (set by the auth middleware)
    const sender = req.user._id;
    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required.' });
    }
    const message = await Message.create({ sender, receiver, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get conversation between the authenticated user and another user
exports.getConversation = async (req, res) => {
  try {
    // The other user's ID is passed as a URL parameter
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    // Find messages where current user is either sender or receiver with the other user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // sort in ascending order by time

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
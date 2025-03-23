// controllers/messageController.js
const Message = require('../models/message');
const mongoose = require('mongoose'); // Needed to convert the req.user._id to an ID type 

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content,senderName, receiverName } = req.body;
    // sender is taken from req.user (set by the auth middleware)
    const sender = req.user._id;
    if (!receiver || !content ||!senderName || !receiverName) {
      return res.status(400).json({ message: 'Receiver and content are required.' });
    }
    const message = await Message.create({sender, receiver, content,senderName, receiverName});
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
// Gets contacts based on who has messaged you, should help when the buyer sends the first message to the seller.
// First message should be in the sellers messages, but the Buyer wont have their conacts until messaged back since they wouldnt have recieved a message yet
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(req.user._id)}},
      { $group: {"_id": "$sender",senderName:{$first: "$senderName"}}},
      { $project: {_id: 0, sender: "$_id",senderName:1}}
    ]);

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
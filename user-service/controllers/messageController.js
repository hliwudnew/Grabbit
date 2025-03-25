const Message = require('../models/message');
const mongoose = require('mongoose');

exports.sendMessage = async (req, res) => {
  try {
    console.log("sendMessage - req.body:", req.body);
    console.log("sendMessage - req.user:", req.user);

    const { receiver, content, receiverName } = req.body;

    if (!receiver || !content || !receiverName) {
      return res.status(400).json({ message: 'Receiver, content, and receiverName are required.' });
    }

    // Use req.user.id instead of req.user._id
    const sender = req.user.id;
    const senderName = req.user.username || "Unknown Sender";

    const message = await Message.create({ sender, receiver, content, senderName, receiverName });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id.toString();

    // Find messages exchanged between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Instead of wrapping in an object, return the messages array directly.
    res.json(messages);
  } catch (error) {
    console.error("Error in getConversation:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    // Use req.user.id and ensure mongoose is imported for ObjectId conversion
    const contacts = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$sender", senderName: { $first: "$senderName" } } },
      { $project: { _id: 0, sender: "$_id", senderName: 1 } }
    ]);

    res.json(contacts);
  } catch (error) {
    console.error("Error in getContacts:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
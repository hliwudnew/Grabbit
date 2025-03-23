// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    content: { type: String, required: true },
    // Optionally, add a conversationId to group messages
    conversationId: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
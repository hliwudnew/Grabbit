const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [mongoose.Schema.Types.Mixed],
  }
);

module.exports = mongoose.model('watchlist', watchlistSchema);
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    username: String,
    displayName: String,
    avatarUrl: String
  },
  content: String,
  image: String,
  hashtags: [String],
  mentions: [String],
  likes: Number,
  comments: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);

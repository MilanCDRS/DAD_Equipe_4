const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    username: String,
    displayName: String,
    avatarUrl: String
  },
  text: String,
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.Mixed, default: [] }]
});

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
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);

const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');

router.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post('/posts', async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.status(201).json(newPost);
});

module.exports = router;

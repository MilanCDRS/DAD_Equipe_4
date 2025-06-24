const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/post.model');

// Multer pour upload image (optionnel)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Liste des posts
router.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

//liste des posts d'un utilisateur
router.get('/posts/user/:username', async (req, res) => {
  const { username } = req.params;
  const posts = await Post.find({ 'user.username': username }).sort({ createdAt: -1 });
  res.json(posts);
});

// Création d’un post (texte + image locale optionnelle)
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { content, user } = req.body;
    let imageBase64 = null;
    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
    }
    const newPost = new Post({
      user: user ? JSON.parse(user) : undefined, // optionnel
      content,
      image: imageBase64
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création du post" });
  }
});

// Like/Unlike (1 like par user)
router.put('/posts/:id/like', async (req, res) => {
  const { username } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  if (post.likes.includes(username)) {
    post.likes = post.likes.filter(u => u !== username);
  } else {
    post.likes.push(username);
  }
  await post.save();
  res.json({ likes: post.likes });
});

// Ajouter un commentaire
router.post('/posts/:id/comments', async (req, res) => {
  const { text, user } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });

  const comment = {
    user, // { username, displayName, avatarUrl }
    text,
    createdAt: new Date()
  };
  post.comments.push(comment);
  await post.save();
  res.status(201).json(comment);
});

// Recuperer les posts commentés par un user 
router.get('/posts/commented/user/:username', async (req, res) => {
  const { username } = req.params;
  const posts = await Post.find({ 'comments.user.username': username }).sort({ createdAt: -1 });
  res.json(posts);
});

// Recuperer les posts likés par un user
router.get('/posts/liked/user/:username', async (req, res) => {
  const { username } = req.params;
  const posts = await Post.find({ likes: username }).sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;

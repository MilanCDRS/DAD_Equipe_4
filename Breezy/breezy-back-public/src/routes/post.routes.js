// src/routes/posts.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllPosts,
  getPostsByUser,
  createPost,
  toggleLike,
  addComment,
} = require("../controller/posts.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Configuration Multer pour upload image en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Routes publiques
router.get("/", getAllPosts);
router.get("/user/:username", getPostsByUser);

// Routes protégées
router.post("/", requireAuth, upload.single("image"), createPost);
router.put("/:id/like", requireAuth, toggleLike);
router.post("/:id/comments", requireAuth, addComment);

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

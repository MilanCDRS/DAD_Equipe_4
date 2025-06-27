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
  fetchPostsCommentedByUser,
  fetchPostsLikedByUser
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
router.get(`/commented/:username`, requireAuth, fetchPostsCommentedByUser);
router.get(`/liked/:username`, requireAuth, fetchPostsLikedByUser);
module.exports = router;

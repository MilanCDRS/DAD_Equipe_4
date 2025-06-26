const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.model');
const Post = require("../models/post.model");

// Ajouter un commentaire ou une réponse
router.post('/:postId', async (req, res) => {
  const { postId } = req.params;
  const { user, text, parentCommentId = null } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const newComment = await Comment.create({
      postId,
      parentCommentId,
      user,
      text,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
});

// Récupérer tous les commentaires d’un post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du chargement des commentaires" });
  }
});

module.exports = router;

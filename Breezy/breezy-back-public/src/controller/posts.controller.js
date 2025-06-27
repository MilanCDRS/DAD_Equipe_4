// src/controllers/posts.controller.js

const Post = require("../models/post.model");

// GET /api/posts
exports.getAllPosts = async (req, res) => {
  try {
    // plus besoin de populate(), on a déjà tous les champs dans user
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur fetch posts :", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des posts" });
  }
};

// GET /api/posts/user/:username
exports.getPostsByUser = async (req, res) => {
  try {
    const { username } = req.params;
    // on filtre sur le champ imbriqué user.username
    const posts = await Post.find({ "user.username": username }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur fetch posts par user :", err);
    res.status(500).json({
      error:
        "Erreur serveur lors de la récupération des posts de l’utilisateur",
    });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    // req.user doit contenir username, displayName et avatar
    const { username, displayName, avatar } = req.user;
    const imageBase64 = req.file?.buffer.toString("base64") || null;

    const newPost = new Post({
      user: { username, displayName, avatar },
      content: req.body.content,
      image: imageBase64,
      createdAt: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Erreur création post :", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création du post" });
  }
};

// PUT /api/posts/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const { username } = req.user;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post introuvable" });

    const idx = post.likes.indexOf(username);
    if (idx !== -1) post.likes.splice(idx, 1);
    else post.likes.push(username);

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (err) {
    console.error("Erreur like/unlike :", err);
    res.status(500).json({ error: "Erreur serveur lors du like" });
  }
};

// POST /api/posts/:id/comments
const mongoose = require("mongoose");

exports.addComment = async (req, res) => {
  const { text, parentCommentId } = req.body;
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post non trouvé" });

    const newComment = {
      _id: new mongoose.Types.ObjectId(), // 👈 ajoute un ID ici
      user: {
        username: req.user.username,
        displayName: req.user.displayName,
        avatar: req.user.avatar
      },
      text,
      createdAt: new Date(),
      replies: []
    };

    let added = false;

    if (parentCommentId) {
      const addReplyRecursively = (comments) => {
        for (let comment of comments) {
          if (comment._id.toString() === parentCommentId) {
            comment.replies.push(newComment);
            return true;
          }
          if (comment.replies?.length > 0) {
            const found = addReplyRecursively(comment.replies);
            if (found) return true;
          }
        }
        return false;
      };

      added = addReplyRecursively(post.comments);
      if (!added)
        return res.status(404).json({ error: "Commentaire parent non trouvé" });
    } else {
      post.comments.push(newComment);
      added = true;
    }

    if (!added) throw new Error("Commentaire non ajouté");

    await post.save();

    // 👇 On renvoie uniquement le commentaire fraîchement ajouté
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/posts/commented/:username
exports.fetchPostsCommentedByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ "comments.user.username": username })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur fetch posts commentés par user :", err);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des posts commentés",
    });
  }
};

// GET /api/posts/liked/:username
exports.fetchPostsLikedByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const posts = await Post.find({ likes: username })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur fetch posts likés par user :", err);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des posts likés",
    });
  }
};


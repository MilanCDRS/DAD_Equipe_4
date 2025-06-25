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
    // req.user doit contenir username, displayName et avatarUrl
    const { username, displayName, avatarUrl } = req.user;
    const imageBase64 = req.file?.buffer.toString("base64") || null;

    const newPost = new Post({
      user: { username, displayName, avatarUrl },
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
exports.addComment = async (req, res) => {
  try {
    const { username, displayName, avatarUrl } = req.user;
    const { text } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post introuvable" });

    // on pousse un sous-doc commentaire avec les infos user
    post.comments.push({
      user: { username, displayName, avatarUrl },
      text,
      createdAt: new Date(),
    });
    await post.save();

    // on renvoie le dernier commentaire créé
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Erreur ajout commentaire :", err);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l’ajout du commentaire" });
  }
};

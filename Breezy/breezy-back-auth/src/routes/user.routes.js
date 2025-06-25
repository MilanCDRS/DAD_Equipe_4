/**
 * File: routes/user.routes.js
 * Description: Defines the API routes for user-related operations.
 */

const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

const userController = require("../controllers/user.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");
// import du middleware
const { requireAuth } = require("../middlewares/auth.middleware");

// -- PUBLIC --

// Récupérer un user par son nom d'utilisateur (public)
router.get("/users/username/:username", async (req, res) => {
  const u = await User.findOne({ username: req.params.username }).select(
    "userId username name avatar"
  );
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
});

// -- PRIVATE --

// Liste des users
router.get("/users", requireAuth, userController.getAllUsers);

// Récupérer un user par ID
router.get("/:userId", requireAuth, userController.getUserById);

// Mettre à jour son propre profil
router.patch(
  "/:userId",
  requireAuth,
  requiredFields(["username", "email"]), // adapte les champs requis
  userController.updateUser
);

// Supprimer son compte
router.delete("/:userId", requireAuth, userController.deleteUser);

module.exports = router;

/**
 * @file auth.routes.js
 * @description Defines the API routes for authentication-related operations.
 *
 */
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadToS3.middleware");
const { updateProfile } = require("../controllers/auth.controller");

// S’inscrire & se connecter
router.post(
  "/register",
  requiredFields(["username", "email", "password"]),
  authController.register
);

router.post(
  "/login",
  requiredFields(["email", "password"]),
  authController.login
);

// Renouvellement reste public (cookie HttpOnly)
router.post("/refresh-token", authController.refreshToken);

// Vérifier que le token est valide
router.get("/authenticate", requireAuth, (req, res) => {
  // si on arrive ici, requireAuth a validé le token
  res.status(200).json({ ok: true, userId: req.userId, role: req.userRole });
});

// Mettre à jour son profil (private + upload avatar)
router.patch("/profile", requireAuth, upload.single("avatar"), updateProfile);

// on pourrait aussi protégé logout
router.post("/logout", requireAuth, authController.logout);

module.exports = router;

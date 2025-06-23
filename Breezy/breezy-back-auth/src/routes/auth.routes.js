/**
 * @file auth.routes.js
 * @description Defines the API routes for authentication-related operations.
 *
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");
const { authenticate } = authController;
const upload = require("../middlewares/uploadToS3");

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

router.post("/refresh-token", authController.refreshToken);

router.get("/authenticate", authController.authenticate);

<<<<<<< HEAD
router.patch("/profile", authenticate, authController.updateProfile);
router.post("/logout", authController.logout);
=======
router.patch(
  "/profile",
  authenticate, // le middleware jtwt
  upload.single("avatar"), // multer va traiter le champ "avatar"
  authController.updateProfile
);

router.post("/logout", authController.logout);

>>>>>>> 5b247bd7a55339714dccbbccaad1675689aa5d92
module.exports = router;

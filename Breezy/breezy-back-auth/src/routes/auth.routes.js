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

router.patch("/profile", authenticate, authController.updateProfile);

module.exports = router;

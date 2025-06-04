/**
 * File: routes/user.routes.js
 * Description: Defines the API routes for user-related operations.
 */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");

// Exemple: création d'un user avec validation des champs obligatoires
router.post(
  "/",
  requiredFields(["username", "email", "password"]),
  userController.createUser
);

module.exports = router;

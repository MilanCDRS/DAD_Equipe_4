/**
 * File: routes/user.routes.js
 * Description: Defines the API routes for user-related operations.
 */

const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.patch("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

router.post(
  "/register",
  requiredFields(["username", "email", "password"]),
  userController.createUser
);

module.exports = router;

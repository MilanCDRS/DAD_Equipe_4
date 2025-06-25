/**
 * File: routes/follower.routes.js
 * Description: Defines the API routes for follower-related operations.
 */

const express = require("express");
const router = express.Router();
const followerController = require("../controller/follower.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Public
router.get("/", followerController.getAllfollowers);

// Public :
router.get(
  "/user/:username",
  followerController.getFollowersAndFollowingsByUsername
);

// Protégé
router.post("/", requireAuth, followerController.createfollower);

// Protégé
router.patch("/:id", requireAuth, followerController.updatefollower);

// Protégé
router.delete("/:id", requireAuth, followerController.deletefollower);

router.delete("/:id", followerController.deletefollower);

module.exports = router;

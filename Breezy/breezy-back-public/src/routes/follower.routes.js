/**
 * File: routes/follower.routes.js
 * Description: Defines the API routes for follower-related operations.
 */

const express = require("express");
const router = express.Router();
const followerController = require("../controller/follower.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

// Public :
// Ensure the controller method exists and is exported correctly
router.get("/user/:username", requireAuth, followerController.getFollowersAndFollowingsByUsername);

// Public
router.get("/", followerController.getAllfollowers);

// Protégé
router.post("/", requireAuth, followerController.createfollower);

// Protégé
router.patch("/:id", requireAuth, followerController.updatefollower);

router.delete("/:id", requireAuth, followerController.deletefollower);

// Remove duplicate route registration to avoid conflicts
// router.delete("/:id", followerController.deletefollower);

module.exports = router;

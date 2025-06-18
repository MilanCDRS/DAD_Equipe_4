/**
 * File: routes/follower.routes.js
 * Description: Defines the API routes for follower-related operations.
 */

const express = require("express");
const router = express.Router();

const followerController = require("../controllers/follower.controller");
const requiredFields = require("../middlewares/requiredFields.middleware");

router.get("/", followerController.getAllfollowers);

router.get("/:id", followerController.getfollowerById);

router.patch("/:id", followerController.updatefollower);

router.delete("/:id", followerController.deletefollower);

module.exports = router;
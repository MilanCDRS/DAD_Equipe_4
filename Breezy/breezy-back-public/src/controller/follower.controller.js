// src/controllers/follower.controller.js

const axios = require("axios");
const FollowerModel = require("../models/follower.model");
const { requireAuth } = require("../middlewares/auth.middleware");

// URL de base du service Auth ou de la gateway
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth:3000";

/** POST : Crée une demande de suivi */
exports.createfollower = async (req, res) => {
  try {

    // Si non fourni dans le body, récupérer depuis les params (pour follower/:username/:usernameToFollow)

    follower = req.params.username;

    following = req.params.usernameToFollow;


    if (!follower || !following) {
      return res.status(400).json({ message: "Missing follower or following" });
    }

    // Vérifier si la relation existe déjà
    const exists = await FollowerModel.findOne({ follower, following });
    if (exists) {
      return res.status(409).json({ message: "Follow request already exists" });
    }

    const newfollower = new FollowerModel({
      follower,
      following,
      accepted: false,
    });

    await newfollower.save();

    res.status(201).json({
      message: "follower created successfully",
      followerId: newfollower._id,
    });
  } catch (err) {
    console.error("follower creation failed", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};



/** GET ALL followers */
exports.getAllfollowers = async (req, res) => {
  try {
    const followers = await FollowerModel.find().lean();
    res.status(200).json(followers);
  } catch (err) {
    console.error("Failed to fetch followers", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

/** GET follower by ID */
exports.getfollowerById = async (req, res) => {
  try {
    const follower = await FollowerModel.findById(req.params.id).lean();
    if (!follower) {
      return res.status(404).json({ message: "Follower not found" });
    }
    res.status(200).json(follower);
  } catch (err) {
    console.error("Failed to get follower", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

/** GET followers & followings par username */
exports.getFollowersAndFollowingsByUsername = [
  requireAuth,
  async (req, res) => {
    try {
      const username = req.params.username;

      const followers = await FollowerModel.find({ following: username }).distinct("follower");
      const followings = await FollowerModel.find({ follower: username }).distinct("following");

      res.json({
        followers,
        followings,
        followersCount: followers.length,
        followingsCount: followings.length,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error: " + err });
    }
  },
];

/** DELETE follower */
exports.deletefollower = async (req, res) => {
  try {
    const deleted = await FollowerModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Follower not found" });
    }
    res.status(200).json({ message: "Follower deleted successfully" });
  } catch (err) {
    console.error("Failed to delete follower", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { username, usernameToUnfollow } = req.params;

    // Vérifier si l'utilisateur à unfollow existe
    const userToUnfollow = await FollowerModel.findOne({
      follower: username,
      following: usernameToUnfollow,
    });

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    // Supprimer la relation de suivi
    await FollowerModel.deleteOne({
      follower: username,
      following: usernameToUnfollow,
    });

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (err) {
    console.error("Failed to unfollow user", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

/** UPDATE (accept request) */
exports.updatefollower = async (req, res) => {
  try {
    const { follower, following, accepted } = req.body;
    const updated = await FollowerModel.findByIdAndUpdate(
      req.params.id,
      { follower, following, accepted },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ message: "Follower not found" });
    }
    res.status(200).json({
      message: "Follower updated successfully",
      follower: updated,
    });
  } catch (err) {
    console.error("Failed to update follower", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};


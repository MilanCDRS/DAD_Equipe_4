// src/controllers/follower.controller.js

const axios = require("axios");
const FollowerModel = require("../models/follower.model");
const { requireAuth } = require("../middlewares/auth.middleware");

// URL de base du service Auth ou de la gateway
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth:3000";

/** POST : Crée une demande de suivi */
exports.createfollower = [
  requireAuth,
  async (req, res) => {
    try {
      // 1. followerId = l'utilisateur authentifié
      const followerId = req.user.userId;

      // 2. followingUsername côté front
      const { followingUsername } = req.body;
      if (!followingUsername) {
        return res
          .status(400)
          .json({ message: "Le champ followingUsername est requis" });
      }

      // 3. Charger l'user “following” depuis Auth
      //    Ici on suppose que ton API Auth expose : GET /users/username/:username
      const { data: followingUser } = await axios.get(
        `${AUTH_SERVICE_URL}/auth/users/username/${followingUsername}`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );

      if (!followingUser) {
        return res
          .status(404)
          .json({ message: "Utilisateur à suivre introuvable chez Auth" });
      }

      // 4. Créer la demande
      const newFollower = new FollowerModel({
        follower: followerId,
        following: followingUser.userId || followingUser._id,
        accepted: false,
      });

      await newFollower.save();
      return res.status(201).json({
        message: "Demande de suivi créée",
        followerId: newFollower._id,
      });
    } catch (err) {
      console.error("createfollower failed via Auth API:", err);
      if (err.response) {
        // Propagation de l'erreur depuis Auth
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Server error: " + err });
    }
  },
];

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
      const { username } = req.params;

      // 1. Charger l'utilisateur pour récupérer son ID
      const { data: user } = await axios.get(
        `${AUTH_SERVICE_URL}/auth/users/username/${username}`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: "Utilisateur introuvable chez Auth" });
      }
      const userId = user.userId || user._id;

      // 2. Récupérer tous ceux qui suivent cet user
      const followersData = await FollowerModel.find({
        following: userId,
      }).lean();
      const followers = followersData.map((f) => f.follower);

      // 3. Récupérer tous ceux que l'utilisateur suit
      const followingsData = await FollowerModel.find({
        follower: userId,
      }).lean();
      const followings = followingsData.map((f) => f.following);

      res.status(200).json({
        followers,
        followings,
        followersCount: followers.length,
        followingsCount: followings.length,
      });
    } catch (err) {
      console.error("Failed to fetch followers/followings via Auth API:", err);
      if (err.response) {
        return res.status(err.response.status).json(err.response.data);
      }
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

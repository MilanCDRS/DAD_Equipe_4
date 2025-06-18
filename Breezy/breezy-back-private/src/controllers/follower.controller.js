/**
 * File : follower.controller.js
 * Description : Controller to manage follower operations such as creating a new follower.
 */

const follower = require("../models/follower.model");

/* CREATE */
exports.createfollower = async (req, res) => {
  try {
    const { follower, following } = req.body;

    const newfollower = new follower({
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

/* GET ALL */
exports.getAllfollowers = async (req, res) => {
  try {
    const followers = await follower.find().select(); // on exclut le mot de passe des résultats
    res.status(200).json(followers);
  } catch (err) {
    console.error("Failed to fetch followers", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* GET */
exports.getfollowerById = async (req, res) => {
  try {
    const follower = await follower.findById(req.params.id).select();
    if (!follower) {
      return res.status(404).json({ message: "follower not found" });
    }
    res.status(200).json(follower);
  } catch (err) {
    console.error("Failed to update follower", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* DELETE  */
exports.deletefollower = async (req, res) => {
  try {
    const deletedfollower = await follower.findByIdAndDelete(req.params.id);
    if (!deletedfollower) {
      return res.status(404).json({ message: "follower not found" });
    }

    res.status(200).json({ message: "follower deleted successfully" });
  } catch (err) {
    console.error("Failed to delete follower", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* Accept request // UPDATE */
exports.updatefollower = async (req, res) => {
  try {
    const { follower, following, accepted } = req.body;

    const updateFields = { follower, following, accepted };

    const updatedfollower = await follower.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select();

    if (!updatedfollower) {
      return res.status(404).json({ message: "follower not found" });
    }

    res.status(200).json({
      message: "follower updated successfully",
      follower: updatedfollower,
    });
  } catch (err) {
    console.error("Failed to update follower", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

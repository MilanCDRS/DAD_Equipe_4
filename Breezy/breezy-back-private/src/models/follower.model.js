/**
 * File : Follower.model.js
 * Description : Mongoose schema for Follower management.
 */

const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema(
  {
    follower: { type: String, required: true},
    following: { type: String, required: true},
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FollowerSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("Follower", FollowerSchema);

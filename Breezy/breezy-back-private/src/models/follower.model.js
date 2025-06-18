/**
 * File : Follower.model.js
 * Description : Mongoose schema for Follower management.
 */

const mongoose = require("mongoose");

const roles = require("../utils/roles");

const FollowerSchema = new mongoose.Schema(
  {
    follower: { type: String, required: true, unique: true },
    followinng: { type: String, required: true, unique: true },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follower", FollowerSchema);

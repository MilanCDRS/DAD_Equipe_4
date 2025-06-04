/**
 * File : user.model.js
 * Description : Mongoose schema for user management.
 */

const mongoose = require("mongoose");
const roles = require("../utils/roles");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      // Avec mongoDB on a pas de schéma strict par défaut, le rappel ici permet de restreindre les valeurs possibles pour role
      enum: Object.values(roles),
      default: "user",
    },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

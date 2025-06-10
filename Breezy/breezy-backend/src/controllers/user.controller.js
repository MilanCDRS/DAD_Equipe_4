/**
 * File : user.controller.js
 * Description : Controller to manage user operations such as creating a new user.
 */

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* CREATE */
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Hash du mot de passe avec bcrypt ( voir backend/documentations/documentation.mrd)

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      passwordHash,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("User creation failed", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* GET ALL */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash"); // on exclut le mot de passe des résultats
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* GET */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to update user", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* DELETE  */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user", err);
    res.status(500).json({ message: "Server error :" + err });
  }
};

/* UPDATE */

exports.updateUser = async (req, res) => {
  try {
    const { username, email, bio, avatar, password } = req.body;

    const updateFields = { username, email, bio, avatar };

    // Si un nouveau mot de passe est fourni, le re-hasher
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Failed to update user", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

/* LOGIN */
exports.loginUser = async (req, res) => {
  console.log("==== reçu côté backend ====");
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // On check sur le user existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // puis on vérifie le mdp
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // on génère alors un token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Le token expire après 1 heure
    );

    // et on renvoie le token et les infos du user
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Login failed", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

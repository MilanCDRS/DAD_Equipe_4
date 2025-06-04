/**
 * File : user.controller.js
 * Description : Controller to manage user operations such as creating a new user.
 */

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

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

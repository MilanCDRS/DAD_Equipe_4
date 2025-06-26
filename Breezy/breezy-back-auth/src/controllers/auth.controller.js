const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sessionCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/", // dispo partout
  // pas de maxAge => cookie de session
};

// Cookie persistant pour le refresh token (7 jours)
const refreshCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/api/auth/refresh-token",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, dateOfBirth, bio, avatar, name } =
      req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await new User({
      username,
      email,
      passwordHash,
      role,
      dateOfBirth,
      bio,
      avatar,
      name,
    }).save();

    // Génère les deux tokens
    const accessToken = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Stocke les cookies
    res
      .cookie("accessToken", accessToken, sessionCookieOpts)
      .cookie("refreshToken", refreshToken, refreshCookieOpts)
      .status(201)
      .json({
        message: "User created",
        userId: newUser._id,
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
      });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("accessToken", accessToken, sessionCookieOpts)
      .cookie("refreshToken", refreshToken, refreshCookieOpts)
      .status(200)
      .json({
        message: "Login successful",
        userId: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const { bio } = req.body;
    const update = { bio };

    if (req.file && req.file.location) {
      update.avatar = req.file.location;
    }

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    if (!updated)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.status(200).json({ message: "Profil mis à jour", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur : " + err });
  }
};

exports.authenticate = (req, res) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Token manquant." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ ok: true, userId: payload.userId, role: payload.role });
  } catch {
    return res.status(403).json({ message: "Token invalide." });
  }
};

// controllers/auth.controller.js
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);

    // Génère un nouveau accessToken
    const newAccessToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Repose **seulement** le accessToken
    res
      .cookie("accessToken", newAccessToken, sessionCookieOpts)
      .status(200)
      .json({ message: "Access token refreshed" });
  });
};

// controllers/auth.controller.js
exports.logout = (req, res) => {
  res.clearCookie("accessToken", sessionCookieOpts);
  res.clearCookie("refreshToken", refreshCookieOpts);
  return res.status(200).json({ message: "Logout successful" });
};

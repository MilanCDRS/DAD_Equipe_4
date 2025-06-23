const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, dateOfBirth, bio, avatar, name } =
      req.body;
    // HASH MDP
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      passwordHash,
      role,
      dateOfBirth,
      bio,
      avatar,
      name,
    });
    await newUser.save();

    // [ACCESS TOKEN] on génère  un JWT à l’inscription avec user id et role
    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(201).json({
      message: "User created",
      userId: newUser._id,
      token: accessToken,
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

    // [ACCESS TOKEN] Génère l'access token (valide 10 minutes)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // [REFRESH TOKEN] Génère le refresh token (valide 7 jours)
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    //Cookie HttpOnly pour refresh token : stocke le refresh token dans un cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // [PROD] true en prod
      sameSite: "Strict",
      path: "/api/auth/refresh-token", // important : correspond à la route utilisée
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    // Renvoie le token d’accès dans la réponse
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      token: accessToken,
    });
  } catch (err) {
    console.error("(back) Login failed:", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

// extrait le token JWT et le vérifie, on l'insère avant tous les handlers qui doivrent être accessibles par un utilisateur connecté
exports.authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    // conserve userId et role sur req
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio } = req.body;
    const update = { bio };

    // Si multer a uploadé un fichier, req.file contient ses infos
    if (req.file) {
      // URL publique en partant de votre dossier /public
      update.avatar = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    if (!updated) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Profil mis à jour", user: updated });
  } catch (err) {
    console.error("Update profile failed:", err);
    res.status(500).json({ message: "Erreur serveur : " + err });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

// src/controllers/auth.controller.js
exports.logout = (req, res) => {
  // on efface le cookie refreshToken
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    path: "/api/auth/refresh-token",
  });
  res.sendStatus(204);
};

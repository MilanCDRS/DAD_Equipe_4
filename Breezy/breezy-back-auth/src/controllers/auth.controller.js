const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash, role });
    await newUser.save();
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ message: "Server error: " + err });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login attempt with body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Génère l'access token (valide 10 minutes)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Génère le refresh token (valide 7 jours)
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Stocke le refresh token dans un cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en prod
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

exports.authenticate = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    res.sendStatus(200);
  });
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

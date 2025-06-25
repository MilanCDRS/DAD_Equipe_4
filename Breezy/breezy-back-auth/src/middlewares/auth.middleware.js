// back-public/src/middleware/auth.js
const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  try {
    // on récupère le token depuis le cookie HttpOnly
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    // on vérifie le token et extrait le payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // expose tout le payload
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(403).json({ message: "Token invalide." });
  }
};

// breezy-back-private/app.js - PAS TESTE J'AI JUSTE MIS CA POUR QU'IL Y A IT DE LA COHERENCE MAIS SI QQ UN VEUT FAIRE API PRIVATE CONTROLEZ
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser()); // ← (<–– très important pour lire req.cookies)
app.use(express.json());

app.use((req, res, next) => {
  const token = req.cookies.accessToken; // ← on lit le cookie HttpOnly
  if (!token) return res.status(401).json({ msg: "Token manquant" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token invalide" });
    req.user = decoded;
    next();
  });
});

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the private API", user: req.user });
});

module.exports = app;

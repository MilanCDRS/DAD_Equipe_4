// breezy-back-private/app.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const followerRoutes = require("./src/routes/follower.routes");
app.use(express.json());

app.use("/api/follower", followerRoutes);

app.use((req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token missing" });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });
    req.user = decoded;
    next();
  });
});


app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the private API", user: req.user });
});

module.exports = app;

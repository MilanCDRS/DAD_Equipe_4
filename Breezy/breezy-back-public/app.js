// src/app.js (Public)
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/posts", require("./src/routes/post.routes"));
app.use("/api/follower", require("./src/routes/follower.routes"));

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the public API" });
});

module.exports = app;

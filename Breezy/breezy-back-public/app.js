const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const postRoutes = require("./src/routes/post.routes");
app.use("/", postRoutes);
const followerRoutes = require("./src/routes/follower.routes");
app.use("/follower", followerRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the public API" });
});

module.exports = app;

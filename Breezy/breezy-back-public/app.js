// breezy-back-public/app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Pour tests en local sans NGINX (facultatif sinon)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the public API" });
});

module.exports = app;

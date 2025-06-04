/**
 * File: app.js
 * Description: Main application file that sets up the Express server and routes.
 */

const express = require("express");
const cors = require("cors");

const userRoutes = require("./src/routes/user.routes");

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json()); // Pour lire les JSON dans les requêtes

// Routes
app.use("/api/users", userRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not" });
});

module.exports = app;

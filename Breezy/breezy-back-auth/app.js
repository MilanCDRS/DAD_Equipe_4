/**
 * File: app.js
 * Description: Main application file that sets up the Express server and routes.
 */

const express = require("express");
const cors = require("cors");

// Cookie parser est utilisé pour gérer les cookies dans les requêtes HTTP
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // ou l’origine du front
    credentials: true, // Pour que les cookies soient envoyés
  })
);

app.use(express.json());
app.use(cookieParser()); // mettre avant les routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/users", require("./src/routes/user.routes"));

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;

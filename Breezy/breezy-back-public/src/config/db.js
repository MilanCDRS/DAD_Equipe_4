/**
 * File : config/db.js
 * Description : Manage the connexion to MongoDB using Mongoboose.
 */

const mongoose = require("mongoose");

// Récupération des variables d'environnement de la DB
const { MONGO_HOST_PUBLIC, MONGO_PORT_PUBLIC, MONGO_DB_PUBLIC } = process.env;

const MONGODB_URI = `mongodb://${MONGO_HOST_PUBLIC}:${MONGO_PORT_PUBLIC}/${MONGO_DB_PUBLIC}`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connexion successful to MongoDB:", MONGODB_URI);
  } catch (err) {
    console.error("Connexion error to MongoDB:", err.message);
    throw err;
  }
};

module.exports = connectDB;

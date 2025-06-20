// middlewares/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error("Erreur interceptée :", err);

  // MongoDB duplicate key (code 11000)
  if (err.code === 11000) {
    const duplicatedField = Object.keys(err.keyValue)[0]; 
    const value = err.keyValue[duplicatedField];

    return res.status(409).json({
      field: duplicatedField,
      message:
        duplicatedField === "email"
          ? `Cet email (${value}) est déjà utilisé.`
          : `Le pseudo "${value}" est déjà pris.`,
    });
  }

  // Validation Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: errors.join(" | ") });
  }

  // Autres erreurs
  res.status(500).json({
    message: "Erreur serveur, veuillez réessayer plus tard.",
  });
};

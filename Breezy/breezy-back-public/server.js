/**
 * File: server.js
 * Description: Main entry point for the Breezy backend server.
 * FR Description: Point d'entrée principal de l'application, dans le workshop on avait index.js mais on l'a split pour avoir un fichier
 * dédié à la configuration de la base de donnée dans cong/db.js donc server.js est le point nouveau d'entrée.
 */

require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Cannot start server : connexion failed to MongoDB : ", err);
    process.exit(1); // Commande Node.js qui arrêt l'execution du processuS. 1 indique une sortie avec erreur tandis que 0 est une sortie normale.
  });

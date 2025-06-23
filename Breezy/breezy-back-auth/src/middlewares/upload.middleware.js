const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1) Dossier de stockage
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 2) Configuration de multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // ex : avatar-<timestamp>.<ext>
    const ext = path.extname(file.originalname);
    const name = `avatar-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = upload;

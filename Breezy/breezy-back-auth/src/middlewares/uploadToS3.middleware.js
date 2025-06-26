// src/middlewares/uploadToS3.js
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3"); // v3.x

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  region: "us-east-1", // toute valeur, MinIO l’ignore
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  },
  forcePathStyle: true,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.MINIO_BUCKET,
    acl: "public-read",
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `avatar-${req.userId}-${Date.now()}.${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = upload;

// src/middlewares/uploadToS3.js
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// configure AWS SDK pour MinIO
const s3 = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT || "http://minio:9000",
  accessKeyId: process.env.MINIO_ROOT_USER || "minio",
  secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "minio123",
  s3ForcePathStyle: true, // required with minio
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.MINIO_BUCKET || "avatars",
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `avatar-${req.userId}-${Date.now()}.${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
});

module.exports = upload;

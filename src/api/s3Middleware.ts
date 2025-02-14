import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

// Check if S3 is configured
const isS3Configured = process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_BUCKET;

let storage;

if (isS3Configured) {
  const s3 = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `thumbnail_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, `blog-thumbnails/${fileName}`);
    },
  });

  console.log("Using S3 storage for uploads");
} else {
  // Create uploads folder if it doesn't exist
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileName = `thumbnail_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });

  console.log("Using local disk storage for uploads");
}

export const uploadThumbnails = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("thumbnails", 3); // Allow up to 3 files with field name 'thumbnails'

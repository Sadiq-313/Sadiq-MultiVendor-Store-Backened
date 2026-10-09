import multer from "multer";
import fs from "fs";

// Vercel serverless environment fix (/tmp directory use karein ya ignore karein)
const uploadDir = process.env.NODE_ENV === "production" ? "/tmp" : "uploads";

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.log("Folder creation skipped for Vercel read-only system.");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });
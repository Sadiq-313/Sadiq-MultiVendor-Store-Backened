import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit root path: src/middlewares -> ../../uploads
const uploadDir = path.resolve(__dirname, "../../uploads");

// Sync check and folder creation
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Exact folder path pass kar rahe hain
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // Safe filename format: avatar-1712345678.png
    const ext = path.extname(file.originalname) || ".png";
    const uniqueFilename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage });
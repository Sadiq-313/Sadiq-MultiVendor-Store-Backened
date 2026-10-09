import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

// 1. CORS enable karein taake frontend live API hit kar sake
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// 2. Base test route
app.get("/", (req, res) => {
  res.json({
    message: "Cartivo API is running successfully!",
  });
});

console.log("Cartivo API is running successfully!");
// 3. Vercel Safe Static Uploads Handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "../uploads");

// Sirf tab static serve karein agar uploads folder real mein exist karta ho (Local Dev)
if (fs.existsSync(uploadsPath)) {
  app.use("/uploads", express.static(uploadsPath));
}

// 4. API Routes
app.use("/api/v2/seller", router);
app.use("/api/v2/product", productRouter);
app.use("/api/v2/event", eventRoutes);
app.use("/api/v2/newsletter", newsletterRoutes);

export default app;
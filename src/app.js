import express from "express";
// import  cros from "cors";
import dotenv from "dotenv";
import router from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { fileURLToPath } from "url";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import path from "path";
dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.json({
    message: "Cartivo API is running"
  })
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));



app.use("/api/v2/seller", router);

app.use("/api/v2/product", productRouter);

// Route declaration
app.use("/api/v2/event", eventRoutes);


app.use("/api/v2/newsletter", newsletterRoutes);



// /api/v2/product/get-all-products


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })

export default app;
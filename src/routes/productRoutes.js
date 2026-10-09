import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getAllProducts,
  getSingleProduct,
  getRelatedProducts,
  createProductReview,
} from "../controllers/productController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// 1. Add New Product
router.post("/create", upload.single("image"), createProduct);

// 2. Get Live Products for Seller
router.get("/seller-products/:sellerId", getSellerProducts);

// 3. Update Existing Product
router.put("/update/:id", upload.single("image"), updateProduct);

// 4. Delete Product
router.delete("/delete/:id", deleteProduct);

// 5. Get All Products (Home Page & Category Filter Query)
router.get("/get-all-products", getAllProducts);

// 6. Get Single Product Details
router.get("/get-product/:id", getSingleProduct);

// 7. Get Related Products
router.get("/related-products/:category/:productId", getRelatedProducts);

// 8. Create or Update Review
router.put("/create-new-review", createProductReview);

export default router;
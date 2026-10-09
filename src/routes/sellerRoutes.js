import express from "express";
import { createSeller, loginSeller , logoutSellerById } from "../controllers/sellerController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Register Route   
// http://localhost:5000/api/v2/seller/createSeller
router.post('/createSeller', upload.single('avatar'),  createSeller);


// Login Route
// http://localhost:5000/api/v2/seller/loginSeller
router.post('/loginSeller', loginSeller);



// LogOut Route
// http://localhost:5000/api/v2/seller/logoutSeller
router.get("/logout/:id", logoutSellerById);


// create product route
router.post('/createProduct', upload.single('productImage'),);

export default router;
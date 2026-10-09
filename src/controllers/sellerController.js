import fs from "fs";
import Seller from "../models/sellerModel.js";



export const createSeller = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { shopName, phoneNumber, email, address, zipCode, password } = req.body;

    // 1. Email ko clean aur lowercase karo
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    // 2. Check karein ki kya seller pehle se exist karta hai
    const existingSeller = await Seller.findOne({ email: cleanEmail });
    if (existingSeller) {
      // Agar seller exist karta hai to uploaded file ko delete kar do
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Seller already exists with this email!",
      });
    }

    // 3. Logo / File check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Shop logo/avatar upload karna zaroori hai!",
      });
    }

    const avatarUrl = req.file.path;

    // 4. Naya seller create karein
    const seller = await Seller.create({
      shopName,
      phoneNumber,
      email: cleanEmail,
      address,
      zipCode,
      password,
      avatar: avatarUrl,
    });

    res.status(201).json({
      success: true,
      message: "Seller account successfully create ho gaya!",
      seller,
    });
  } catch (error) {
    // Catch block mein bhi failure par file clean kar do
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("EXACT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Seller Login Controller
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur Password dono enter karein!",
      });
    }

    // Seller ko find karein
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Is email se koi seller account nahi mila!",
      });
    }

    // Password match karein (sellerModel ke comparePassword method se)
    const isPasswordMatched = await seller.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Ghalat password! Dobara koshish karein.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller Login Successful!",
      seller,
    });
  } catch (error) {
    console.log("EXACT ERROR:", error); // Terminal mein full error print hoga
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3 seller logout controller
//  Logout Seller by ID

export const logoutSellerById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Database mein Seller verify karo
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller database mein nahi mila!",
      });
    }

    // 2. Clear authentication cookie
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    });

    // 3. Success response with real seller data (like shopName)
    return res.status(200).json({
      success: true,
      message: `${seller.shopName || "Seller"} successfully logged out!`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
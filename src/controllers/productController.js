import fs from "fs";
import Product from "../models/productModel.js";

// 1. CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { title, price, category, description, sellerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image is required!" });
    }

    if (!title || !price || !category || !description || !sellerId) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newProduct = await Product.create({
      title,
      price,
      category,
      description,
      images: req.file.path,
      seller: sellerId,
    });

    return res.status(201).json({ success: true, message: "Product created!", product: newProduct });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category, description } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: "Product nahi mila!",
      });
    }

    const updatedData = {
      title: title || product.title,
      price: price || product.price,
      category: category || product.category,
      description: description || product.description,
    };

    if (req.file) {
      if (product.images && fs.existsSync(product.images)) {
        fs.unlinkSync(product.images);
      }
      updatedData.images = req.file.path;
    }

    product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product successfully update ho gaya!",
      product,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product nahi mila!",
      });
    }

    if (product.images && fs.existsSync(product.images)) {
      fs.unlinkSync(product.images);
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product aur uski image successfully delete ho gaye!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. GET SELLER PRODUCTS
export const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.find({ seller: sellerId });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. GET ALL PRODUCTS & CATEGORY FILTER
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    // Agar URL mein query variable ho ?category=Computers to filter lag jaye
    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("seller", "shopName name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 6. GET SINGLE PRODUCT DETAILS BY ID
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "seller",
      "shopName name email avatar"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product nahi mila!",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 7. GET RELATED PRODUCTS (Same category, excluding current product)
export const getRelatedProducts = async (req, res) => {
  try {
    const { category, productId } = req.params;

    const relatedProducts = await Product.find({
      category: category,
      _id: { $ne: productId },
    }).limit(5);

    return res.status(200).json({
      success: true,
      products: relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 8. CREATE OR UPDATE PRODUCT REVIEW
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId, userId, userName } = req.body;

    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product nahi mila!",
      });
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === userId.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === userId.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Review successfully submit ho gaya!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
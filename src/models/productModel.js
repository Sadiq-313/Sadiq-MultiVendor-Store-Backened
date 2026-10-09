import mongoose from "mongoose";

// Categories ki list
export const categoriesList = [
  "Computers and Laptops",
  "Cosmetics and Body Care",
  "Accessories",
  "Cloths",
  "Shoes",
  "Gifts",
  "Pet Care",
  "Mobile and Tablets",
  "Music and Gaming",
  "Others",
];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required!"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required!"],
    },
    category: {
      type: String,
      required: [true, "Product category is required!"],
      enum: {
        values: categoriesList,
        message: "Please select a valid category from the list!",
      },
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
    },
    images: {
      type: String,
      required: [true, "Product image is required!"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
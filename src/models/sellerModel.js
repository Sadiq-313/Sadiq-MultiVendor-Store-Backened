import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const sellerSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: [true, "Please enter your shop name!"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your shop email address"],
      unique: true, // Ek email se ek hi shop ban sakti hai
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Password should be greater than 6 characters"],
    },
    // Logo image ka path store karne ke liye
    avatar: {
      type: String, 
      required: true,
    },
    // // Custom roles ke liye (future use)
    role: {
      type: String,
      default: "Seller",
    },
  },
  { timestamps: true } // is se createdAt aur updatedAt automatically ban jayenge
);


sellerSchema.pre("save", function (next){
    if (!this.isModified("password")) {
    next();
}
this.password =  bcrypt.hashSync(this.password, 10);
})
sellerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model("Seller", sellerSchema);
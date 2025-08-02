// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     userID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'users',
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     manufacturer: {
//       type: String,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       required: true,
//     },
//     description: String,
//   },
//   { timestamps: true }
// );


// const Product = mongoose.model("product", ProductSchema);
// module.exports = Product;


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Refers to the "users" collection
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing whitespace
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true, // Ensures clean data
    },
    stock: {
      type: Number,
      required: true,
      default: 0, // Sets default stock to 0
      min: [0, "Stock cannot be negative"], // Prevents negative stock
    },
    lowStockThreshold: {
      type: Number,
      default: 10, // Default threshold for low stock
      min: [1, "Low stock threshold must be at least 1"], // Ensures valid thresholds
    },
    description: {
      type: String,
      trim: true, // Clean description
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;

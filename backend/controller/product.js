// const Product = require("../models/Product");
// const Purchase = require("../models/purchase");
// const Sales = require("../models/sales");

// // Add Post
// const addProduct = (req, res) => {
//   console.log("req: ", req.body.userId);
//   const addProduct = new Product({
//     userID: req.body.userId,
//     name: req.body.name,
//     manufacturer: req.body.manufacturer,
//     stock: 0,
//     description: req.body.description,
//   });

//   addProduct
//     .save()
//     .then((result) => {
//       res.status(200).send(result);
//     })
//     .catch((err) => {
//       res.status(402).send(err);
//     });
// };

// // Get All Products
// const getAllProducts = async (req, res) => {
//   const findAllProducts = await Product.find({
//     userID: req.params.userId,
//   }).sort({ _id: -1 }); // -1 for descending;
//   res.json(findAllProducts);
// };

// // Delete Selected Product
// const deleteSelectedProduct = async (req, res) => {
//   const deleteProduct = await Product.deleteOne(
//     { _id: req.params.id }
//   );
//   const deletePurchaseProduct = await Purchase.deleteOne(
//     { ProductID: req.params.id }
//   );

//   const deleteSaleProduct = await Sales.deleteOne(
//     { ProductID: req.params.id }
//   );
//   res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
// };

// // Update Selected Product
// const updateSelectedProduct = async (req, res) => {
//   try {
//     const updatedResult = await Product.findByIdAndUpdate(
//       { _id: req.body.productID },
//       {
//         name: req.body.name,
//         manufacturer: req.body.manufacturer,
//         description: req.body.description,
//       },
//       { new: true }
//     );
//     console.log(updatedResult);
//     res.json(updatedResult);
//   } catch (error) {
//     console.log(error);
//     res.status(402).send("Error");
//   }
// };

// // Search Products
// const searchProduct = async (req, res) => {
//   const searchTerm = req.query.searchTerm;
//   const products = await Product.find({
//     name: { $regex: searchTerm, $options: "i" },
//   });
//   res.json(products);
// };

// module.exports = {
//   addProduct,
//   getAllProducts,
//   deleteSelectedProduct,
//   updateSelectedProduct,
//   searchProduct,
// };


const Product = require("../models/Product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");

// Add Post
const addProduct = (req, res) => {
  const addProduct = new Product({
    userID: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    stock: req.body.stock || 0, // Default stock to 0 if not provided
    lowStockThreshold: req.body.lowStockThreshold || 10, // Default threshold to 10 if not provided
    description: req.body.description,
  });

  addProduct
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const findAllProducts = await Product.find({
      userID: req.params.userId,
    }).sort({ _id: -1 });

    // Add stock status dynamically
    const productsWithStockStatus = findAllProducts.map((product) => {
      let status = "In Stock"; // Default status
      if (product.stock === 0) status = "No Stock";
      else if (product.stock <= product.lowStockThreshold) status = "Low Stock";

      return { ...product._doc, stockStatus: status };
    });

    res.json(productsWithStockStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.deleteOne({ _id: req.params.id });
    const deletePurchaseProduct = await Purchase.deleteOne({ ProductID: req.params.id });
    const deleteSaleProduct = await Sales.deleteOne({ ProductID: req.params.id });

    res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        stock: req.body.stock, // Update stock if provided
        lowStockThreshold: req.body.lowStockThreshold, // Update low stock threshold if provided
      },
      { new: true }
    );
    res.json(updatedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating product" });
  }
};

// Update Stock
const updateStock = async (req, res) => {
  try {
    const { productID, stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({ error: "Stock cannot be negative" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productID,
      { stock },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating stock" });
  }
};

// Search Products
const searchProduct = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const products = await Product.find({
    name: { $regex: searchTerm, $options: "i" },
  });
  res.json(products);
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  updateStock, // New function to update stock
  searchProduct,
};

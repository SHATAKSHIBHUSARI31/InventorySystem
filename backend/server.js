const express = require("express");
const cors = require("cors");
const { main } = require("./models/index");

const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const userRoutes = require("./router/users");
const authRoutes = require("./router/auth"); // 🔑 Auth controller for login/register

const Product = require("./models/Product");

const app = express();
const PORT = 4000;

// Connect to DB
main();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/store", storeRoute);
app.use("/api/product", productRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/sales", salesRoute);
app.use("/api/users", userRoutes);        // For user management (if any)
app.use("/api/auth", authRoutes);         // ✅ For login and register

// Test route (optional)
app.get("/testget", async (req, res) => {
  const result = await Product.findOne(); // Just for testing DB connection
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});


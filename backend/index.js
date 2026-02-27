const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Harshit Paints API is running" });
});

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

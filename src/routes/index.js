const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const userRoutes = require("./user.routes");

const {
  authenticateToken,
  isAdmin,
} = require("../middlewares/auth.middleware");

// Health check route
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});




// API routes
router.use("/auth", authRoutes);

// User routes (protected)
router.use("/user", authenticateToken, userRoutes);

// Admin routes (protected)
router.use("/admin", authenticateToken, isAdmin, adminRoutes);



module.exports = router;

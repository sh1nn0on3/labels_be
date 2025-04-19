const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const userRoutes = require("./user.routes");
const balanceController = require("../controllers/balance.controller");

const {
  authenticateToken,
  isAdmin,
} = require("../middlewares/auth.middleware");

// Health check route
router.get("/ping", (req, res) => {
  res.json({ status: "pong", timestamp: new Date().toISOString() });
});


// API routes
router.use("/auth", authRoutes);

router.post('/webhook', express.raw({type: 'application/json'}), balanceController.handleWebhook);

// User routes (protected)
router.use("/user", authenticateToken, userRoutes);

// Admin routes (protected)
router.use("/admin", authenticateToken, isAdmin, adminRoutes);



module.exports = router;

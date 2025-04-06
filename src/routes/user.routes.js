const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/upload.middleware");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const shipmentController = require("../controllers/shipment.controller");
const balanceController = require("../controllers/balance.controller");
const notificationController = require('../controllers/notification.controller');

// User routes
router.get("/profile", userController.getProfile);
router.put("/change-password", userController.changePassword);
router.post("/upload", uploadMiddleware, uploadController.uploadFile);

// Shipment routes
router.post("/shipments", uploadMiddleware, shipmentController.createShipment); 
router.get("/shipments", shipmentController.getShipments);
router.get("/shipment/:id", shipmentController.getShipmentById);
router.delete("/shipment/:id", shipmentController.deleteShipment);
router.get("/shipment/status/:status", shipmentController.getShipmentByStatus);

// Balance routes
router.post('/deposit', balanceController.deposit);
router.post('/create-checkout-session', balanceController.createCheckoutSession);

// Stripe webhook route (no auth middleware needed)

// notification routes
router.get('/notifications', notificationController.getActiveNotifications); // Assuming you have a method to get active notifications

module.exports = router;

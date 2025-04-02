const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const shipmentController = require("../controllers/shipment.controller");
const notificationController = require('../controllers/notification.controller');
const settingController = require('../controllers/setting.controller');
const uploadMiddleware = require("../middlewares/upload.middleware");
const { authenticateToken, isAdmin } = require("../middlewares/auth.middleware");

// Apply authentication and admin middleware to all routes
router.use(authenticateToken, isAdmin);

// Middleware to check if the user is an admin
router.get("/users", adminController.getUsers); 
router.get("/users/:id", adminController.getProfileUser); 
router.put("/users/:id", adminController.updateUser); 
router.delete("/users/:id", adminController.deleteUser); 
router.get("/search", adminController.searchUsers); 

// shipment routes
router.get('/price' , adminController.getPrice);
router.get('/price/:id' , adminController.getPriceById);
router.post('/price' , adminController.createPrice);
router.put('/price/:id' , adminController.updatePrice);
router.delete('/price/:id' , adminController.deletePrice);

// shipment routes
router.get('/shipment' , shipmentController.getAllShipments); 
router.get('/shipment/:id' , shipmentController.getShipmentByIdAdmin); 
router.delete('/shipment/:id' , shipmentController.deleteShipmentAdmin); 
router.get('/shipment/status/:status' , shipmentController.getShipmentByStatusAdmin); 
router.put('/shipment/:id' , shipmentController.updateShipmentStatus); 
router.post('/shipment/labels', uploadMiddleware , shipmentController.createShipmentLabel);
router.post('/shipment/:id/labels', uploadMiddleware, shipmentController.createShipmentLabelAdmin);

// notification routes
router.get('/notifications', notificationController.getAllNotifications); 
router.put('/notifications/:id', notificationController.updateNotification); 
router.delete('/notifications/:id', notificationController.deleteNotification); 
router.post('/notifications', notificationController.createNotification); 

// Settings routes
router.get('/settings', settingController.getAllSettings);
router.get('/settings/:id', settingController.getSettingById);
router.post('/settings', settingController.createSetting);
router.put('/settings/:id', settingController.updateSetting);
router.delete('/settings/:id', settingController.deleteSetting);

module.exports = router;

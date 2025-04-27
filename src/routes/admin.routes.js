const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const shipmentController = require("../controllers/shipment.controller");
const notificationController = require('../controllers/notification.controller');
const settingController = require('../controllers/setting.controller');
const uploadMiddleware = require("../middlewares/upload.middleware");
const { authenticateToken, isAdmin } = require("../middlewares/auth.middleware");
const { decryptMiddleware } = require("../middlewares/decode.middleware");

// Apply authentication and admin middleware to all routes
router.use(authenticateToken, isAdmin);

// Add JSON parsing middleware for admin routes
router.use(express.json());

// Middleware to check if the user is an admin
router.get("/users", adminController.getUsers); 
router.get("/user/:id", adminController.getProfileUser); 
router.put("/user/:id", decryptMiddleware ,  adminController.updateUser); 
router.delete("/user/:id", adminController.deleteUser); 
router.get("/search", adminController.searchUsers); 

// shipment routes
router.get('/price' , adminController.getPrice);
router.get('/price/:id' , adminController.getPriceById);
router.post('/price' , decryptMiddleware ,adminController.createPrice);
router.put('/price/:id' , decryptMiddleware , adminController.updatePrice);
router.delete('/price/:id' , adminController.deletePrice);

// shipment routes
router.get('/shipments' , shipmentController.getAllShipments); 
router.get('/shipments/:id' , shipmentController.getShipmentByIdAdmin); 
router.delete('/shipments/:id' , shipmentController.deleteShipmentAdmin); 
router.get('/shipments/status/:status' , shipmentController.getShipmentByStatusAdmin); 
router.put('/shipments/:id' , decryptMiddleware,decryptMiddleware ,shipmentController.updateShipment); 
router.post('/shipments/labels', uploadMiddleware , decryptMiddleware , shipmentController.createShipmentLabel);
router.post('/shipments/:id/labels', uploadMiddleware, decryptMiddleware ,shipmentController.createShipmentLabelAdmin);

// notification routes
router.get('/notifications', notificationController.getAllNotifications); 
router.put('/notifications/:id', decryptMiddleware ,notificationController.updateNotification); 
router.delete('/notifications/:id', notificationController.deleteNotification); 
router.post('/notifications', decryptMiddleware ,notificationController.createNotification); 

// Settings routes
router.get('/settings', settingController.getAllSettings);
router.get('/setting/:id', settingController.getSettingById);
router.post('/setting',decryptMiddleware  ,settingController.createSetting);
router.put('/setting/:id',  decryptMiddleware ,settingController.updateSetting);
router.delete('/setting/:id', settingController.deleteSetting);

module.exports = router;

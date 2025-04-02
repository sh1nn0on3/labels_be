const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const shipmentController = require("../controllers/shipment.controller");


router.get("/users", adminController.getUsers); 
router.get("/users/:id", adminController.getProfileUser); 
router.put("/users/:id", adminController.updateUser); 
router.delete("/users/:id", adminController.deleteUser); 
router.get("/search", adminController.searchUsers); 

router.get('/price' , adminController.getPrice);
router.get('/price/:id' , adminController.getPriceById);
router.post('/price' , adminController.createPrice);
router.put('/price/:id' , adminController.updatePrice);
router.delete('/price/:id' , adminController.deletePrice);

router.get('/shipment' , shipmentController.getAllShipments); 
router.get('/shipment/:id' , shipmentController.getShipmentByIdAdmin); 
router.delete('/shipment/:id' , shipmentController.deleteShipmentAdmin); 
router.get('/shipment/status/:status' , shipmentController.getShipmentByStatusAdmin); 
router.put('/shipment/:id' , shipmentController.updateShipmentStatus); 


module.exports = router;

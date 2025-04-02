const shipmentService = require("../services/shipment/shipment.service");
const ResponseHelper = require("../utils/response.helper");


class shipmentController{
    async createShipment(req, res) {
        try {
            const userId = req.user.id;
            const shipmentData = req.body;
            const file = req.file; // Assuming the file is available in req.file
            if (!file) {
                return ResponseHelper.badRequest(res, 'No file uploaded');
            }
            if (!shipmentData) {
                return ResponseHelper.badRequest(res, 'No shipment data provided');
            }

            const result = await shipmentService.createShipment(userId, file , shipmentData);
            return ResponseHelper.success(res, result, 'Shipment created successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipments(req, res) {
        try {
            const userId = req.user.id;
            const shipments = await shipmentService.getShipments(userId);
            return ResponseHelper.success(res, shipments, 'Shipments retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipmentById(req, res) {
        try {
            const userId = req.user.id;
            const shipmentId = req.params.id;
            const shipment = await shipmentService.getShipmentById(userId, shipmentId);
            return ResponseHelper.success(res, shipment, 'Shipment retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async deleteShipment(req, res) {
        try {
            const userId = req.user.id;
            const shipmentId = req.params.id;
            const result = await shipmentService.deleteShipment(userId, shipmentId);
            return ResponseHelper.success(res, result, 'Shipment deleted successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipmentByStatus(req, res) {
        try {
            const userId = req.user.id;
            const status = req.params.status;
            const shipments = await shipmentService.getShipmentByStatus(userId, status);
            return ResponseHelper.success(res, shipments, 'Shipments retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    // ADMIN SHIPMENT FUNCTIONS
    async getAllShipments(req, res) {
        try {
            const shipments = await shipmentService.getAllShipments();
            return ResponseHelper.success(res, shipments, 'All shipments retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipmentByIdAdmin(req, res) {
        try {
            const shipmentId = req.params.id;
            const shipment = await shipmentService.getShipmentByIdAdmin(shipmentId);
            return ResponseHelper.success(res, shipment, 'Shipment retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async updateShipmentStatus(req, res) {
        try {
            const shipmentId = req.params.id;
            const status = req.body.status;
            const result = await shipmentService.updateShipmentStatus(shipmentId, status);
            return ResponseHelper.success(res, result, 'Shipment status updated successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }
    async deleteShipmentAdmin(req, res) {
        try {
            const shipmentId = req.params.id;
            const result = await shipmentService.deleteShipmentAdmin(shipmentId);
            return ResponseHelper.success(res, result, 'Shipment deleted successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipmentByStatusAdmin(req, res) {
        try {
            const status = req.params.status;
            const shipments = await shipmentService.getShipmentByStatusAdmin(status);
            return ResponseHelper.success(res, shipments, 'Shipments retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

}

module.exports = new shipmentController();
const constants = require("../constants/appConstants");
const shipmentService = require("../services/shipment/shipment.service");
const { logCreateShipment } = require("../utils/auditLog.helper");
const ResponseHelper = require("../utils/response.helper");


class shipmentController{
    async createShipment(req, res) {
        const userId = req.user.id;
        const shipmentData = req.body;
        const file = req.file; // Assuming the file is available in req.file
        try {
            if (!file) {
                return ResponseHelper.badRequest(res, 'No file uploaded');
            }
            if (!shipmentData) {
                return ResponseHelper.badRequest(res, 'No shipment data provided');
            }
            const result = await shipmentService.createShipment(userId, file, shipmentData);
            const fileUrl = `${constants.DOMAIN}/${result.fileName}`;
            logCreateShipment(req, userId, req.user.username, 'success', 'create_shipment', `Shipment created successfully with ID: ${result.id}, File: ${fileUrl}, and Data: ${JSON.stringify(result)}`);
            return ResponseHelper.success(res, result, 'Shipment created successfully');
        } catch (error) {
            logCreateShipment(req, userId, req.user.username, 'error','create_shipment', error.message);
            return ResponseHelper.error(res, error.message);
        }
    }

    async getShipments(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const { shipments, pagination } = await shipmentService.getShipments(userId, page, limit);
            
            return ResponseHelper.success(
                res, 
                { shipments, pagination }, 
                'Shipments retrieved successfully'
            );
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
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
            const limit = parseInt(req.query.limit) || 10; // Số lượng item mỗi trang mặc định là 10
            
            const { shipments, total, totalPages } = await shipmentService.getAllShipments(page, limit);
            
            return ResponseHelper.success(res, 
                { 
                    shipments, 
                    pagination: {
                        total,
                        totalPages,
                        currentPage: page,
                        limit
                    } 
                }, 
                'All shipments retrieved successfully'
            );
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

    async updateShipment(req, res) {
        try {
            const shipmentId = req.params.id;
            const data = req.body;
            const result = await shipmentService.updateShipment(shipmentId, data);
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

    async createShipmentLabel(req, res) {
        const shipmentId = req.body.shipmentId;
        const file = req.file; // Assuming the file is available in req.file
        const userId = req.user.id;
        try {
            if (!file) {
                return ResponseHelper.badRequest(res, 'No file uploaded');
            }
            const result = await shipmentService.createShipmentLabel(userId, file, shipmentId);
            const fileUrl = `${constants.DOMAIN}/labels/${result.labelUrl.split(',').pop()}`;
            return ResponseHelper.success(res, { fileUrl }, 'Shipment label created successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

    async createShipmentLabelAdmin(req, res) {
        const shipmentId = req.params.id;
        const file = req.file; // Assuming the file is available in req.file
        try {
            if (!file) {
                return ResponseHelper.badRequest(res, 'No file uploaded');
            }
            const result = await shipmentService.createShipmentLabelAdmin(file, shipmentId);
            const fileUrl = `${constants.DOMAIN}/uploads/labels/${result.labelUrl.split(',').pop()}`;
            return ResponseHelper.success(res, { fileUrl }, 'Shipment label created successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }
    
    async searchShipments(req, res) {
        try {
            const userId = req.user.id;
            const query = req.query.q; // Assuming the search query is passed as a query parameter
            const shipments = await shipmentService.searchShipments(userId, query);
            return ResponseHelper.success(res, shipments, 'Shipments retrieved successfully');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }

}

module.exports = new shipmentController();
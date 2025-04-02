const ResponseHelper = require('../utils/response.helper');
const UploadService = require('../services/upload/upload.service');


class uploadController {
    async uploadFile(req, res) {
        try {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const file = req.file; // Assuming the file is available in req.file

        if (!file) {
            return ResponseHelper.badRequest(res, 'No file uploaded');
        }
    
        const result = await UploadService.uploadFile(userId, file);
        return ResponseHelper.success(res, result, 'Shipment uploaded successfully');
        } catch (error) {
        return ResponseHelper.error(res, error.message);
        }
    }
}

module.exports = new uploadController();

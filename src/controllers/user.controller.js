const ResponseHelper = require('../utils/response.helper');
const UserService = require('../services/user/userService');

class UserController {
    async getProfile(req, res) {
        try {
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        const userProfile = await UserService.getProfile(userId);
        return ResponseHelper.success(res, userProfile);
        } catch (error) {
        return ResponseHelper.error(res, error.message);
        }
    }
    
    async changePassword(req, res) {
        try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
        await UserService.changePassword(userId, oldPassword, newPassword);
        return ResponseHelper.success(res, null, 'Password changed successfully');
        } catch (error) {
        return ResponseHelper.error(res, error.message);
        }
    }
}

module.exports = new UserController(); 
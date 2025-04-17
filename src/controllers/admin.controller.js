const ResponseHelper = require("../utils/response.helper");
const UserService = require("../services/user/userService");
const priceService = require("../services/price/price.service");

class AdminController {
  // User Management
  async getUsers(req, res) {
    try {
      // Get pagination parameters from query string
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await UserService.getAllUsers(page, limit);
      return ResponseHelper.success(res, users);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async getProfileUser(req, res) {
    try {
      const userId = req.params.id;
      const userProfile = await UserService.getProfile(userId);
      return ResponseHelper.success(res, userProfile);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      await UserService.deleteUser(userId);
      return ResponseHelper.success(res, null, "User deleted successfully");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const userData = req.body;
      await UserService.updateUser(userId, userData);
      return ResponseHelper.success(res, null, "User updated successfully");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async searchUsers(req, res) {
    try {
      const query = req.query.q;
      const users = await UserService.searchUsers(query);
      return ResponseHelper.success(res, users);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  // Price Management
  async getPrice(req, res) {
    try {
      // Extract pagination parameters from query
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Get paginated shipping prices
      const result = await priceService.getShippingPrice(page, limit);
      
      return ResponseHelper.success(res, result);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async getPriceById(req, res) {
    try {
      const priceId = req.params.id;
      const price = await priceService.getShippingPriceById(priceId);
      return ResponseHelper.success(res, price);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async createPrice(req, res) {
    try {
      const priceData = req.body;
      await priceService.createShippingPrice(priceData);
      return ResponseHelper.success(res, null, "Price created successfully");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async updatePrice(req, res) {
    try {
      const priceId = req.params.id;
      const priceData = req.body;
      await priceService.updateShippingPrice(priceId, priceData);
      return ResponseHelper.success(res, null, "Price updated successfully");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async deletePrice(req, res) {
    try {
      const priceId = req.params.id;
      await priceService.deleteShippingPrice(priceId);
      return ResponseHelper.success(res, null, "Price deleted successfully");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = new AdminController();

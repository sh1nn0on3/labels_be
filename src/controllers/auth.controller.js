const authService = require('../services/auth/auth.service');
const ResponseHelper = require('../utils/response.helper');
const CommonHelper = require('../utils/common.helper');
const { logLogin, logReg } = require('../utils/auditLog.helper');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate email format
      if (!CommonHelper.isValidEmail(email)) {
        return ResponseHelper.badRequest(res, 'Invalid email format');
      }

      // Validate password strength
      const passwordValidation = CommonHelper.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return ResponseHelper.validationError(res, passwordValidation.errors);
      }

      const result = await authService.register({ username, email, password });
      logReg(req, result.user.id, result.user.username, 'register', 'User registered successfully');
      return ResponseHelper.created(res, CommonHelper.removeSensitiveData(result));
    } catch (error) {
      return ResponseHelper.badRequest(res, error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate email format
      if (!CommonHelper.isValidEmail(email)) {
        return ResponseHelper.badRequest(res, 'Invalid email format');
      }
      
      const result = await authService.login(email, password);
      logLogin(req, result.user.id, result.user.username, 'login', 'User logged in successfully');
      return ResponseHelper.success(res, CommonHelper.removeSensitiveData(result));
    } catch (error) {
      return ResponseHelper.unauthorized(res, error.message);
    }
  }

  async logout(req, res) {
    try {
      await authService.logout(req.user.id);
      return ResponseHelper.success(res, null, 'Logged out successfully');
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return ResponseHelper.success(res, CommonHelper.removeSensitiveData(result));
    } catch (error) {
      return ResponseHelper.unauthorized(res, error.message);
    }
  }
}

module.exports = new AuthController(); 
const settingService = require('../services/setting.service');
const ResponseHelper = require('../utils/response.helper');

// Create new setting
exports.createSetting = async (req, res) => {
  try {
    const settingData = {
      setting_name: req.body.setting_name,
      setting_key: req.body.setting_key,
      setting_value: req.body.setting_value,
      setting_type: req.body.setting_type || "string",
      setting_status: req.body.setting_status || 'active'
    };
    
    const setting = await settingService.createSetting(settingData);
    return ResponseHelper.success(res, setting, 'Setting created successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

// Get all settings with pagination and search
exports.getAllSettings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const result = await settingService.getAllSettings(page, limit, search);
    return ResponseHelper.success(res, result, 'Settings retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};


// Get setting by ID
exports.getSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    const setting = await settingService.getSettingById(id);
    return ResponseHelper.success(res, setting, 'Setting retrieved successfully');
  } catch (error) {
    if (error.message === 'Setting not found') {
      return ResponseHelper.notFound(res, error.message);
    }
    return ResponseHelper.error(res, error.message);
  }
};

// Update setting
exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const settingData = {
      setting_name: req.body.setting_name,
      setting_key: req.body.setting_key,
      setting_value: req.body.setting_value,
      setting_type: req.body.setting_type,
      setting_status: req.body.setting_status
    };
    
    const setting = await settingService.updateSetting(id, settingData);
    return ResponseHelper.success(res, setting, 'Setting updated successfully');
  } catch (error) {
    if (error.message === 'Setting not found') {
      return ResponseHelper.notFound(res, error.message);
    }
    return ResponseHelper.error(res, error.message);
  }
};

// Delete setting
exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    await settingService.deleteSetting(id);
    return ResponseHelper.success(res, null, 'Setting deleted successfully');
  } catch (error) {
    if (error.message === 'Setting not found') {
      return ResponseHelper.notFound(res, error.message);
    }
    return ResponseHelper.error(res, error.message);
  }
}; 
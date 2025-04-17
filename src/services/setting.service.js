const Setting = require("../models/setting.model");
const { Op } = require("sequelize");

// Create a new setting
exports.createSetting = async (settingData) => {
  try {
    if (
      !settingData.setting_name ||
      !settingData.setting_key ||
      !settingData.setting_value
    ) {
      throw new Error("Setting name and key are required");
    }

    const isCheck = await Setting.findOne({
      where: { setting_key: settingData.setting_key },
    });
    if (isCheck) {
      throw new Error("Setting key already exists");
    }

    const setting = await Setting.create(settingData);
    return setting;
  } catch (error) {
    throw new Error(`Error creating setting: ${error.message}`);
  }
};

// Get all settings with pagination and search
exports.getAllSettings = async (page = 1, limit = 10, search = "") => {
  try {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { setting_name: { [Op.like]: `%${search}%` } },
            { setting_key: { [Op.like]: `%${search}%` } },
            { setting_value: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Setting.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      settings: rows,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      itemsPerPage: limit,
      searchTerm: search || null,
    };
  } catch (error) {
    throw new Error(`Error fetching settings: ${error.message}`);
  }
};

// Get setting by ID
exports.getSettingById = async (id) => {
  try {
    const setting = await Setting.findByPk(id);
    if (!setting) {
      throw new Error("Setting not found");
    }
    return setting;
  } catch (error) {
    throw new Error(`Error fetching setting: ${error.message}`);
  }
};

// Update setting
exports.updateSetting = async (id, settingData) => {
  try {
    const setting = await Setting.findByPk(id);
    if (!setting) {
      throw new Error("Setting not found");
    }

    await setting.update(settingData);
    return setting;
  } catch (error) {
    throw new Error(`Error updating setting: ${error.message}`);
  }
};

// Delete setting
exports.deleteSetting = async (id) => {
  try {
    const setting = await Setting.findByPk(id);
    if (!setting) {
      throw new Error("Setting not found");
    }

    await setting.destroy();
    return { message: "Setting deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting setting: ${error.message}`);
  }
};

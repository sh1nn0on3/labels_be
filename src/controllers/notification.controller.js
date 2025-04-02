const notificationService = require('../services/notification.service');
const ResponseHelper = require("../utils/response.helper");

// Create new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const notification = await notificationService.createNotification({
      title,
      content,
      type,
      createdBy: req.user.id
    });
    return ResponseHelper.success(res, notification, 'Notification created successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

// Get all notifications (for admin)
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    return ResponseHelper.success(res, notifications, 'Notifications retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

// Get active notifications (for users)
exports.getActiveNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getActiveNotifications();
    return ResponseHelper.success(res, notifications, 'Active notifications retrieved successfully');
  } catch (error) {
    return ResponseHelper.error(res, error.message);
  }
};

// Update notification
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, isActive } = req.body;
    
    const notification = await notificationService.updateNotification(id, {
      title,
      content,
      type,
      isActive,
      updatedBy: req.user.id
    });

    return ResponseHelper.success(res, notification, 'Notification updated successfully');
  } catch (error) {
    if (error.message === 'Notification not found') {
      return ResponseHelper.notFound(res, error.message);
    }
    return ResponseHelper.error(res, error.message);
  }
};

// Delete notification (soft delete by setting isActive to false)
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id);
    return ResponseHelper.success(res, null, 'Notification deleted successfully');
  } catch (error) {
    if (error.message === 'Notification not found') {
        return ResponseHelper.notFound(res, error.message);
    }
    return ResponseHelper.error(res, error.message);
  }
};

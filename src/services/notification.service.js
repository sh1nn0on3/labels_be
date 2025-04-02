const Notification = require('../models/notification.model');
const { Op } = require('sequelize');

class NotificationService {
  async createNotification(data) {
    return await Notification.create(data);
  }

  async getAllNotifications() {
    return await Notification.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async getActiveNotifications() {
    return await Notification.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
  }

  async getNotificationById(id) {
    return await Notification.findByPk(id);
  }

  async updateNotification(id, data) {
    const notification = await this.getNotificationById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return await notification.update(data);
  }

  async deleteNotification(id) {
    const notification = await this.getNotificationById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return await notification.update({ isActive: false });
  }
}

module.exports = new NotificationService(); 
const { Op } = require("sequelize");
const { User } = require("../../models");
const {
  checkUserUploadEligibility,
  extractFileInfo,
  parseFileData,
  validateAndProcessData,
} = require("../../utils/checkExcel.helper");
const ShippingOrder = require("../../models/shippingOrder.model");
const constants = require("../../constants/appConstants");
const fs = require('fs');
const path = require('path');

class ShipmentService {
  async createShipment(userId, file, shipmentData) {
    const { projectName, notes } = shipmentData;
    if (!projectName) {
      throw new Error("Project name is required");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    checkUserUploadEligibility(user);
    const { filePath, fileName, fileType } = extractFileInfo(file);
    const data = await parseFileData(filePath, fileType);
    const processedData = await validateAndProcessData(data);

    // Check if user has sufficient balance
    if (user.balance < processedData.totalPrice) {
      // Delete the uploaded file if balance is insufficient
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error("Insufficient balance to process this shipment");
    }

    const fileStorageType = constants.FILE_STORAGE_TYPES;
    const shippingOrder = await ShippingOrder.create({
      userId,
      projectName: projectName,
      fileName: fileName,
      totalOrders: processedData.totalCountedOrders,
      totalCost: processedData.totalPrice,
      status: "pending",
      isTemporary: false,
      fileStorageType: fileStorageType,
      processedAt: new Date(),
      notes: notes || "",
    });

    // Update user's balance
    await user.update({
      balance: user.balance - processedData.totalPrice
    });

    return shippingOrder;
  }

  async getShipments(userId) {
    const shipments = await ShippingOrder.findAll({
      where: {
        userId: userId,
        isTemporary: false,
      },
      order: [["createdAt", "DESC"]],
    });
    return shipments;
  }

  async getShipmentById(userId, shipmentId) {
    const shipment = await ShippingOrder.findOne({
      where: {
        id: shipmentId,
        userId: userId,
        isTemporary: false,
      },
    });
    if (!shipment) {
      throw new Error("Shipment not found");
    }
    return shipment;
  }

  async getShipmentsByStatus(userId, status) {
    const shipments = await ShippingOrder.findAll({
      where: {
        userId: userId,
        status: status,
        isTemporary: false,
      },
      order: [["createdAt", "DESC"]],
    });
    return shipments;
  }

  async deleteShipment(userId, shipmentId) {
    const shipment = await ShippingOrder.findOne({
      where: {
        id: shipmentId,
        userId: userId,
        isTemporary: false,
      },
    });
    if (!shipment) {
      throw new Error("Shipment not found");
    }
    shipment.status = "rejected";
    await shipment.save();
    return shipment;
  }

  // ADMIN SHIPMENT FUNCTIONS
  async getAllShipments() {
    const shipments = await ShippingOrder.findAll({
      where: {
        isTemporary: false,
      },
      order: [["createdAt", "DESC"]],
    });
    return shipments;
  }

  async getShipmentByIdAdmin(shipmentId) {
    const shipment = await ShippingOrder.findOne({
      where: {
        id: shipmentId,
        isTemporary: false,
      },
    });
    if (!shipment) {
      throw new Error("Shipment not found");
    }
    return shipment;
  }

  async deleteShipmentAdmin(shipmentId) {
    const shipment = await ShippingOrder.findOne({
      where: {
        id: shipmentId,
        isTemporary: false,
      },
    });
    if (!shipment) {
      throw new Error("Shipment not found");
    }
    shipment.status = "rejected";
    await shipment.save();
    return shipment;
  }

  async getShipmentsByStatusAdmin(status) {
    const shipments = await ShippingOrder.findAll({
      where: {
        status: status,
        isTemporary: false,
      },
      order: [["createdAt", "DESC"]],
    });
    return shipments;
  }
}

module.exports = new ShipmentService();

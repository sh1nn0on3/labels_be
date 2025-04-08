const { User, Transaction } = require("../../models");
const {
  checkUserUploadEligibility,
  extractFileInfo,
  parseFileData,
  validateAndProcessData,
} = require("../../utils/checkExcel.helper");
const ShippingOrder = require("../../models/shippingOrder.model");
const constants = require("../../constants/appConstants");
const fs = require("fs");
const sequelize = require("../../config/database");
const path = require("path");

class ShipmentService {
  async createShipment(userId, file, shipmentData) {
    const { projectName, notes } = shipmentData;
    let filePath = null;

    try {
      if (!projectName) {
        throw new Error("Project name is required");
      }

      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      checkUserUploadEligibility(user);
      const fileInfo = extractFileInfo(file);
      filePath = fileInfo.filePath;
      const fileName = fileInfo.fileName;
      const fileType = fileInfo.fileType;

      const data = await parseFileData(filePath, fileType);
      const processedData = await validateAndProcessData(data);

      // Check if user has sufficient balance
      if (user.balance < processedData.totalPrice) {
        throw new Error("Insufficient balance to process this shipment");
      }

      const fileStorageType = constants.FILE_STORAGE_TYPES;

      // Start a transaction to ensure data consistency
      const t = await sequelize.transaction();

      try {
        const shippingOrder = await ShippingOrder.create(
          {
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
          },
          { transaction: t }
        );

        // Update user's balance
        await user.update(
          {
            balance: user.balance - processedData.totalPrice,
          },
          { transaction: t }
        );

        // Create transaction record
        await Transaction.create(
          {
            userId,
            shippingOrderId: shippingOrder.id,
            amount: processedData.totalPrice,
            type: "debit",
            description: `Payment for shipment ${shippingOrder.id} - ${projectName}`,
            status: "completed",
            metadata: {
              fileName,
              totalOrders: processedData.totalCountedOrders,
            },
          },
          { transaction: t }
        );

        await t.commit();

        const projectDir = constants.TEMP_DATA_DIR;
        if (!fs.existsSync(projectDir)) {
          fs.mkdirSync(projectDir, { recursive: true });
        }
        const newFilePath = path.join(projectDir, fileName);
        fs.renameSync(filePath, newFilePath);

        return shippingOrder;
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      // Xử lý xóa file trong mọi trường hợp lỗi
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Đã xóa tệp tạm thời: ${filePath}`);
        } catch (deleteError) {
          console.error(`Không thể xóa tệp ${filePath}:`, deleteError);
        }
      }
      throw error;
    }
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

  async createShipmentLabel(userId, file, shipmentId) {
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

    // Create labels directory if it doesn't exist
    const labelsDir = constants.LABELS_DIR;
    if (!fs.existsSync(labelsDir)) {
      fs.mkdirSync(labelsDir, { recursive: true });
    }

    const fileInfo = extractFileInfo(file);
    const filePath = fileInfo.filePath;
    const fileName = fileInfo.fileName;
    
    // Move file to labels directory
    const newFilePath = path.join(labelsDir, fileName);
    fs.renameSync(filePath, newFilePath);
    
    // Update labelUrl in database - append new filename to existing ones
    let labelUrls = shipment.labelUrl ? shipment.labelUrl.split(',') : [];
    labelUrls.push(fileName);
    
    shipment.labelUrl = labelUrls.join(',');
    await shipment.save();

    return shipment;
  }

  async createShipmentLabelAdmin(file, shipmentId) {
    const shipment = await ShippingOrder.findOne({
      where: {
        id: shipmentId,
        isTemporary: false,
      },
    });
    if (!shipment) {
      throw new Error("Shipment not found");
    }

    // Create labels directory if it doesn't exist
    const labelsDir = constants.LABELS_DIR;
    if (!fs.existsSync(labelsDir)) {
      fs.mkdirSync(labelsDir, { recursive: true });
    }

    const fileInfo = extractFileInfo(file);
    const filePath = fileInfo.filePath;
    const fileName = fileInfo.fileName;
    
    // Move file to labels directory
    const newFilePath = path.join(labelsDir, fileName);
    fs.renameSync(filePath, newFilePath);
    
    // Update labelUrl in database - append new filename to existing ones
    let labelUrls = shipment.labelUrl ? shipment.labelUrl.split(',') : [];
    labelUrls.push(fileName);
    
    shipment.labelUrl = labelUrls.join(',');
    await shipment.save();

    return shipment;
  }

}

module.exports = new ShipmentService();

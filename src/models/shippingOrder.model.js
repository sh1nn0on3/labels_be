const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShippingOrder = sequelize.define('ShippingOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  labelUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  fileStorageType: {
    type: DataTypes.ENUM('local', 'drive'),
    allowNull: false,
    defaultValue: 'local'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  isTemporary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  processedAt: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = ShippingOrder; 
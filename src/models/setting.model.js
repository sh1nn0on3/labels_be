const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  setting_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  setting_key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  setting_value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  uuid: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  setting_type: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  setting_status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Setting; 
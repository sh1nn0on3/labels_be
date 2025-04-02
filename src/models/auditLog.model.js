const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
  },
  username: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
  action: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
  details: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true,
  },
  ipAddress: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = AuditLog;

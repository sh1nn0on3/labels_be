const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ShippingPrice = sequelize.define("ShippingPrice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  minWeight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maxWeight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  description: {
    type: DataTypes.STRING,
  },
});

module.exports = ShippingPrice;

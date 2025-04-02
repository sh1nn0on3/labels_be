const AuditLog = require("../models/auditLog.model");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

async function logLogin(
  req,
  userId,
  username,
  action = "login",
  details = null,
  status = "success"
) {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "Unknown";

    await AuditLog.create({
      userId,
      username,
      action,
      details,
      status,
      ipAddress,
    });

    return true;
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    throw new Error("Failed to create audit log");
  }
}

async function logReg(
  req,
  userId,
  username,
  action = "register",
  details = null,
  status = "success"
) {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "Unknown";

    await AuditLog.create({
      userId,
      username,
      action,
      details,
      status,
      ipAddress,
    });

    return true;
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    throw new Error("Failed to create audit log");
  }
}

async function logCreateShipment(
  req,
  userId,
  username,
  status,
  action = "create_shipment",
  details = null
) {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "Unknown";

    await AuditLog.create({
      userId,
      username,
      action,
      status,
      details,
      ipAddress,
    });

    return true;
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    throw new Error("Failed to create audit log");
  }
}

module.exports = {
  logLogin,
  logReg,
  logCreateShipment,
};

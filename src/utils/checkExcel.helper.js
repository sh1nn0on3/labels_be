// fileProcessingHelpers.js
const path = require("path");
const { parseCSV, parseXLSX, validateRequiredFields } = require("./file.helpers");
const constants = require("../constants/appConstants");
const { calculatePrice } = require("./calculatePrice.helper");
const requiredFields = constants.REQUIRE_FILEDS_CSV;

const parseFileData = async (filePath, fileType) => {
  let data;
  if (fileType === ".csv") {
    data = await parseCSV(filePath);
  } else if (fileType === ".xlsx") {
    data = await parseXLSX(filePath);
  } else {
    throw new Error("Định dạng tập tin không được hỗ trợ");
  }
  
  return data;
};


const validateAndProcessData = async (data) => {
  const validationResult = validateRequiredFields(data, requiredFields);
  if (!validationResult.isValid) {
    throw new Error(
      `Thiếu trường bắt buộc: ${validationResult.missingFields.join(", ")}`
    );
  }
  const processedData = await calculatePrice(data);
  return processedData;
};


const checkUserUploadEligibility = (user) => {
  console.log("🚀 ~ checkUserUploadEligibility ~ user:", user.balance)
  if (user.balance < 1) {
    throw new Error("Transaction cannot be completed due to insufficient balance.");
  }
  return true;
};


const extractFileInfo = (file) => {
  const filePath = file.path;
  const fileName = file.filename;
  const fileType = path.extname(file.originalname).toLowerCase();
  const fileId = path.basename(fileName, fileType);
  
  return { filePath, fileName, fileType, fileId };
};

module.exports = {
  parseFileData,
  validateAndProcessData,
  checkUserUploadEligibility,
  extractFileInfo
};
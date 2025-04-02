// uploadService.js
const { Op } = require("sequelize");
const { User } = require("../../models");
const { checkUserUploadEligibility, extractFileInfo, parseFileData, validateAndProcessData } = require("../../utils/checkExcel.helper");


class UploadService {
  async uploadFile(userId, file) {
    const user = await User.findByPk(userId);
    checkUserUploadEligibility(user);
    const { filePath, fileName, fileType } = extractFileInfo(file);
    const data = await parseFileData(filePath, fileType);
    const processedData = await validateAndProcessData(data);
    
    // Return result
    const result = {
      fileName: fileName,
      fileType: fileType,
      data: processedData,
    };
    
    return result;
  }
}

module.exports = new UploadService();
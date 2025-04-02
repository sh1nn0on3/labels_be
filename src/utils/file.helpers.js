const fs = require("fs").promises;
const path = require("path");
const { parse } = require("csv-parse");
const xlsx = require("xlsx");
const constants = require("../constants/appConstants");

// Parse CSV files
exports.parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.readFile(filePath, "utf8")
      .then((fileContent) => {
        parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
          .on("data", (row) => {
            data.push(row);
          })
          .on("end", () => {
            resolve(data);
          })
          .on("error", (err) => {
            reject(new Error(`Lỗi khi phân tích tập tin CSV: ${err.message}`));
          });
      })
      .catch((err) => {
        reject(new Error(`Không thể đọc tập tin: ${err.message}`));
      });
  });
};

// Parse XLSX files
exports.parseXLSX = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error(`Lỗi khi phân tích tập tin XLSX: ${error.message}`);
  }
};

// Validate required fields
exports.validateRequiredFields = (data, requiredFields) => {
  if (!data || data.length === 0) {
    return { isValid: false, missingFields: ['Dữ liệu trống'] };
  }
  
  const missingFields = [];
  
  // Check the first row for required fields
  const firstRow = data[0];
  requiredFields.forEach(field => {
    if (!(field in firstRow)) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Setup cleanup scheduler
exports.setupCleanupScheduler = () => {
  const cleanupFiles = async () => {
    try {
      console.log("Đang dọn dẹp các tập tin hết hạn...");

      // Clean up data files
      const dataFiles = await fs.readdir(constants.TEMP_DATA_DIR);
      const metaFiles = dataFiles.filter((file) => file.endsWith("_meta.json"));

      for (const metaFile of metaFiles) {
        const fileId = metaFile.replace("_meta.json", "");
        const metaPath = path.join(constants.TEMP_DATA_DIR, metaFile);
        const dataPath = path.join(constants.TEMP_DATA_DIR, `${fileId}.json`);

        try {
          const metaContent = await fs.readFile(metaPath, "utf8");
          const metadata = JSON.parse(metaContent);

          if (metadata.expiresAt < Date.now()) {
            await fs.unlink(metaPath).catch(() => {});
            await fs.unlink(dataPath).catch(() => {});
            console.log(`Đã xóa tập tin hết hạn: ${fileId}`);
          }
        } catch (err) {
          console.error(`Lỗi khi xử lý tập tin ${metaFile}: ${err.message}`);
        }
      }

      // Clean up upload files older than 1 hour
      const uploadFiles = await fs.readdir(constants.TEMP_UPLOADS_DIR);
      const now = Date.now();

      for (const file of uploadFiles) {
        const filePath = path.join(constants.TEMP_UPLOADS_DIR, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > constants.ONE_HOUR_IN_MS) {
          await fs.unlink(filePath).catch(() => {});
          console.log(`Đã xóa tập tin tải lên hết hạn: ${file}`);
        }
      }
    } catch (err) {
      console.error("Lỗi khi dọn dẹp tập tin:", err);
    }
  };

  // Run cleanup every hour
  setInterval(cleanupFiles, constants.CLEANUP_INTERVAL_MS);

  // Run cleanup immediately on startup
  cleanupFiles();
};

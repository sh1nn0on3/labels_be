const path = require("path");

const constants = {
  PORT : process.env.PORT || 3000,
  DOMAIN : process.env.DOMAIN || "http://localhost:3000",

  TEMP_UPLOADS_DIR: path.join(__dirname, "..", "temp_uploads"),
  TEMP_DATA_DIR: path.join(__dirname, "..", "temp_data"),
  LABELS_DIR: path.join(__dirname, "..", "uploads", "labels"),
  CLEANUP_INTERVAL_MS: 3600000, // 1 hour
  ONE_HOUR_IN_MS: 3600000, // 1 hour

  // File upload limits
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB
  ALLOWED_TYPES_CSV : {
    ".csv": "text/csv",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  ALLOWED_LABEL_TYPES: {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed"
  },
  REQUIRE_FILEDS_CSV: ["PackageWeight"],
  FILE_STORAGE_TYPES: 'local', // 'local' or 's3'
};

module.exports = constants;
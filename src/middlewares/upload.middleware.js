const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const constants = require("../constants/appConstants");
const ResponseHelper = require("../utils/response.helper");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "temp_uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${extension}`);
  },
});

// File filter to only allow csv and xlsx files
const fileFilter = (req, file, cb) => {
  const allowedTypes = constants.ALLOWED_TYPES_CSV;
  const allowedLabelTypes = constants.ALLOWED_LABEL_TYPES;

  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if the file is a label file or a shipment file
  if ((allowedTypes[ext] && mimetype === allowedTypes[ext]) || 
      (allowedLabelTypes[ext] && mimetype === allowedLabelTypes[ext])) {
    cb(null, true);
  } else {
    const allowedExtensions = [...Object.keys(allowedTypes), ...Object.keys(allowedLabelTypes)].join(', ');
    cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions}`), false);
  }
};

// Configure upload limits (15MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: constants.MAX_FILE_SIZE }, // 15MB
  fileFilter: fileFilter,
});

// Middleware để xử lý lỗi của multer
const uploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Lỗi từ Multer (VD: file quá lớn)
        return ResponseHelper.error(res, "File upload error: " + err.message, 400);
      } else if (err) {
        // Lỗi do file không hợp lệ
        return ResponseHelper.error(res, err.message, 400);
      }
    }
    req.uploadedFile = req.file;
    next();
  });
};

module.exports = uploadMiddleware;

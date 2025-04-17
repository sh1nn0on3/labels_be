const CryptoJS = require('crypto-js');
const path = require('path');

// Lấy secret key từ biến môi trường
const SECRET_KEY = process.env.CRYPTO_SECRET_KEY || 'default-secret-key';

const decodeData = (encryptedData) => {
  if (!encryptedData) return null;
  
  try {
    // Giải mã bằng AES
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
    // Parse từ JSON string thành object
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decode error:', error);
    return null;
  }
};


const decryptJsonData = (req, res, next) => {
  // Kiểm tra xem dữ liệu có được mã hóa không
  if (req.headers['x-encrypted-data'] === 'true' && req.body && req.body.data) {
    try {
      // Giải mã dữ liệu
      const decodedData = decodeData(req.body.data);
      
      if (decodedData) {
        // Thay thế req.body bằng dữ liệu đã giải mã
        req.body = decodedData;
      } else {
        return res.status(400).json({ error: 'Invalid encrypted data' });
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      return res.status(400).json({ error: 'Failed to decrypt data' });
    }
  }
  
  next();
};


const decryptFormData = (req, res, next) => {
  // Chỉ xử lý nếu có dữ liệu được mã hóa
  if (req.headers['x-contains-encrypted-fields'] === 'true' && req.body) {
    try {
      const decryptedBody = { ...req.body };
      
      // Duyệt qua các trường trong form data
      Object.keys(req.body).forEach(key => {
        // Kiểm tra xem trường này có được mã hóa không
        const isEncrypted = req.body[`${key}_encrypted`] === 'true';
        
        // Nếu trường được đánh dấu là đã mã hóa, giải mã và thay thế giá trị
        if (isEncrypted) {
          try {
            const encryptedValue = req.body[key];
            const decodedData = decodeData(encryptedValue);
            
            if (decodedData && decodedData.value !== undefined) {
              // Kiểm tra xem giá trị là JSON string hay không
              try {
                decryptedBody[key] = JSON.parse(decodedData.value);
              } catch {
                // Nếu không phải JSON string, sử dụng giá trị nguyên thủy
                decryptedBody[key] = decodedData.value;
              }
              
              // Xóa trường đánh dấu
              delete decryptedBody[`${key}_encrypted`];
            }
          } catch (decodeError) {
            console.error(`Error decoding field ${key}:`, decodeError);
          }
        }
      });
      
      // Cập nhật req.body với dữ liệu đã giải mã
      req.body = decryptedBody;
    } catch (error) {
      console.error('Error processing encrypted form data:', error);
    }
  }
  
  next();
};


const decryptMiddleware = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  
  if (contentType.includes('application/json')) {
    decryptJsonData(req, res, next);
  } else if (contentType.includes('multipart/form-data')) {
    // Giả định rằng file và formdata đã được xử lý bởi middleware khác
    // Chỉ thực hiện giải mã các trường
    decryptFormData(req, res, next);
  } else {
    next();
  }
};

// Export các hàm để sử dụng ở nơi khác nếu cần
module.exports = {
  decryptMiddleware,
  decryptJsonData,
  decryptFormData,
  decodeData
};
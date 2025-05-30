const { verifyAccessToken } = require('../utils/jwt');
const ResponseHelper = require('../utils/response.helper');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return ResponseHelper.unauthorized(res, 'Access token required');
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return ResponseHelper.unauthorized(res, 'Invalid or expired access token');
  }

  req.user = decoded;
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return ResponseHelper.forbidden(res, 'Access denied. Admins only');
  }
};

module.exports = {
  authenticateToken,
  isAdmin
}; 
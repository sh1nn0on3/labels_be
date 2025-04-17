const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { decryptMiddleware } = require('../middlewares/decode.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', decryptMiddleware, authController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 
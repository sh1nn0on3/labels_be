const crypto = require('crypto');

class CommonHelper {
  // Generate random string
  static generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Format date to ISO string
  static formatDate(date) {
    return new Date(date).toISOString();
  }

  // Check if value is empty (null, undefined, empty string, empty array, empty object)
  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  // Remove sensitive data from object
  static removeSensitiveData(obj, fields = ['password', 'token']) {
    const newObj = { ...obj };
    fields.forEach(field => {
      if (field in newObj) {
        delete newObj[field];
      }
    });
    return newObj;
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      // isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      isValid: password.length >= minLength,
      errors: {
        minLength: password.length < minLength ? 'Password must be at least 8 characters long' : null,
        hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
        hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
        hasNumbers: !hasNumbers ? 'Password must contain at least one number' : null,
        hasSpecialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null
      }
    };
  }

  // Paginate array
  static paginateArray(array, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return array.slice(startIndex, endIndex);
  }

  // Generate pagination metadata
  static generatePaginationMetadata(total, page, limit) {
    return {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = CommonHelper; 
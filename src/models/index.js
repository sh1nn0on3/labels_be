const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');

// Define relationships
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  RefreshToken
}; 
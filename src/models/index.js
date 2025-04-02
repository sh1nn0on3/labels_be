const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');
const Transaction = require('./transaction.model');
const ShippingOrder = require('./shippingOrder.model');

// Define relationships
User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens'
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions'
});

Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

ShippingOrder.hasMany(Transaction, {
  foreignKey: 'shippingOrderId',
  as: 'transactions'
});

Transaction.belongsTo(ShippingOrder, {
  foreignKey: 'shippingOrderId',
  as: 'shippingOrder'
});

module.exports = {
  User,
  RefreshToken,
  Transaction,
  ShippingOrder
}; 
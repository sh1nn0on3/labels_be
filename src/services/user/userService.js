const { Op } = require("sequelize");
const { User } = require("../../models");

class UserService {
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await user.comparePassword(oldPassword);
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    user.password = newPassword;
    await user.save();
  }
}

module.exports = new UserService();

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

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ["password"] },
    });
  }
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
  }

  async updateUser(userId, userData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(userData);
  }

  async searchUsers(query) {
    return await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${query}%` } },
          { username: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: { exclude: ["password"] },
    });
  }
}

module.exports = new UserService();

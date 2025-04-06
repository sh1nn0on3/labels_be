const { Op } = require('sequelize');
const { User, RefreshToken } = require('../../models');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: userData.email }, { username: userData.username }]
      }
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const user = await User.create(userData);
    return {
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async logout(userId) {
    await RefreshToken.destroy({
      where: { userId }
    });
  }

  async refreshToken(token) {
    const refreshToken = await RefreshToken.findOne({
      where: { token }
    });

    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (refreshToken.expiresAt < new Date()) {
      await refreshToken.destroy();
      throw new Error('Refresh token expired');
    }

    const user = await User.findByPk(refreshToken.userId);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await refreshToken.update({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}

module.exports = new AuthService(); 
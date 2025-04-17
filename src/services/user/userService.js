const { Op } = require("sequelize");
const { User, ShippingOrder } = require("../../models");

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

  async getAllUsers(page, limit) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: offset
    });
    
    return {
      users: rows,
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      itemsPerPage: limit
    };
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


  async getDashboard(userId) {
    // Base counts by status
    const shipmentsCount = await ShippingOrder.count({
      where: { userId: userId },
    });
    
    const shipmentsPending = await ShippingOrder.count({
      where: {
        userId: userId,
        status: "pending",
      },
    });
    
    const shipmentsProcessing = await ShippingOrder.count({
      where: {
        userId: userId,
        status: "processing",
      },
    });
    
    const shipmentsCompleted = await ShippingOrder.count({
      where: {
        userId: userId,
        status: "completed",
      },
    });
    
    const shipmentsRejected = await ShippingOrder.count({
      where: {
        userId: userId,
        status: "rejected",
      },
    });
    
    // Total cost of all shipments
    const shipmentsCost = await ShippingOrder.sum("cost", {
      where: { userId: userId },
    }) || 0; // Default to 0 if null
    
    // Get current date info for monthly data
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Get monthly data for the current year
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      
      const monthlyShipments = await ShippingOrder.count({
        where: {
          userId: userId,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
      
      const monthlyRevenue = await ShippingOrder.sum("cost", {
        where: {
          userId: userId,
          status: "completed",
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        }
      }) || 0;
      
      monthlyData.push({
        month: month + 1,
        name: new Date(currentYear, month, 1).toLocaleString('default', { month: 'short' }),
        shipments: monthlyShipments,
        revenue: monthlyRevenue
      });
    }
    
    // Format and return results
    const results = {
      shipments: {
        pending: shipmentsPending,
        processing: shipmentsProcessing,
        completed: shipmentsCompleted,
        rejected: shipmentsRejected,
        totalShipments: shipmentsCount,
        totalCost: shipmentsCost
      },
      monthlyData: monthlyData
    };
    
    return results;
  }

}

module.exports = new UserService();

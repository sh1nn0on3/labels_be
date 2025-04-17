const { Op } = require("sequelize");
const ShippingPrice = require("../../models/shippingPrice.model");

async function validateShippingPrice(data) {
  const { minWeight, maxWeight, price, description } = data;
  if (minWeight <= 0 || maxWeight <= 0 || price <= 0 || !description) {
    throw new Error("Min weight, max weight and price must be greater than 0");
  }
  if (minWeight >= maxWeight) {
    throw new Error("Min weight must be less than max weight");
  }

  if (price <= 0) {
    throw new Error("Price must be greater than 0");
  }

  if (!description) {
    throw new Error("Description is required");
  }

  const existingWeights = await ShippingPrice.findAll({
    attributes: ["minWeight"],
    where: { minWeight: { [Op.eq]: minWeight } },
  });

  if (existingWeights.length > 0) {
    throw new Error("Min weight already exists in the list");
  }
}

class PriceService {
  async getShippingPrice(page = 1, limit = 10) {
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * limit;
      
      // Get total count
      const count = await ShippingPrice.count();
      
      // Get paginated shipping prices
      const shippingPrices = await ShippingPrice.findAll({
        offset,
        limit,
        order: [['id', 'ASC']] // You can change the ordering as needed
      });
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(count / limit);
      
      // Return formatted response with pagination data
      return {
        shippingPrices,
        pagination: {
          total: count,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error("Error fetching shipping price: " + error.message);
    }
  }

  async getShippingPriceById(id) {
    try {
      const shippingPrice = await ShippingPrice.findOne({
        where: { id },
      });
      if (!shippingPrice) {
        throw new Error("Shipping price not found");
      }
      return shippingPrice;
    } catch (error) {
      throw new Error("Error fetching shipping price: " + error.message);
    }
  }

  async createShippingPrice(data) {
    try {
      await validateShippingPrice(data);
      const shippingPrice = await ShippingPrice.create(data);
      return shippingPrice;
    } catch (error) {
      throw new Error("Error creating shipping price: " + error.message);
    }
  }

  async updateShippingPrice(id, data) {
    try {
      await validateShippingPrice(data);
      const shippingPrice = await ShippingPrice.update(data, {
        where: { id },
      });
      return shippingPrice;
    } catch (error) {
      throw new Error("Error updating shipping price: " + error.message);
    }
  }
  async deleteShippingPrice(id) {
    try {
      const shippingPrice = await ShippingPrice.destroy({
        where: { id },
      });
      return shippingPrice;
    } catch (error) {
      throw new Error("Error deleting shipping price: " + error.message);
    }
  }
}

module.exports = new PriceService();

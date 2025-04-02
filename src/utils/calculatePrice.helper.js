const ShippingPrice = require("../models/shippingPrice.model");
const { Op } = require("sequelize");

/**
 * Count orders by weight ranges and calculate total price
 * @param {Array} data - Array of order items with PackageWeight property
 * @returns {Promise<Object>} - Object containing order counts by weight range, total price, and total counted orders
 */
async function calculatePrice(data) {

    // Fetch all weight ranges from ShippingPrice table
    const shippingPrices = await ShippingPrice.findAll({
        where: { isActive: true },
        order: [['minWeight', 'ASC']]
    });
    
    if (!shippingPrices || shippingPrices.length === 0) {
        throw new Error("No shipping price ranges found");
    }
    
    // Initialize result object
    const result = {
        totalPrice: 0,
        totalCountedOrders: 0,
        weightRangeCounts: {}
    };
    
    // Create weight range categories with descriptive names
    shippingPrices.forEach(range => {
        const rangeName = `${range.minWeight} - ${range.maxWeight}`;
        result.weightRangeCounts[rangeName] = 0;
    });
    
    // Count orders by weight and calculate total price
    for (const item of data) {
        // Skip items with no weight value
        if (!item.PackageWeight) {
            continue;
        }
        
        const weight = parseFloat(item.PackageWeight);
        let matched = false;
        
        // Find matching weight range
        for (const range of shippingPrices) {
            if (weight >= range.minWeight && weight <= range.maxWeight) {
                const rangeName = `${range.minWeight} - ${range.maxWeight}`;
                result.weightRangeCounts[rangeName]++;
                result.totalPrice += parseFloat(range.price);
                result.totalCountedOrders++; // Increment counted orders
                matched = true;
                break;
            }
        }
        
        // If no matching range found, use the highest range
        if (!matched && weight > 0) {
            const highestRange = shippingPrices[shippingPrices.length - 1];
            const rangeName = `${highestRange.minWeight} - ${highestRange.maxWeight}`; // Fixed variable reference
            result.weightRangeCounts[rangeName]++;
            result.totalPrice += parseFloat(highestRange.price);
            result.totalCountedOrders++; // Increment counted orders
        }
    }
    
    // Remove any ranges with zero counts (optional)
    Object.keys(result.weightRangeCounts).forEach(key => {
        if (result.weightRangeCounts[key] === 0) {
            delete result.weightRangeCounts[key];
        }
    });
    
    return result;
}

module.exports = { calculatePrice };
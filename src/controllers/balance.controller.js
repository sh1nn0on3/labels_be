const balanceService = require("../services/balance/balance.service");
const ResponseHelper = require("../utils/response.helper");

class balanceController {
    async deposit(req, res) {
        try {
            const { amount } = req.body;
            const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
            await balanceService.deposit(userId, amount);
            return ResponseHelper.success(res, null, 'Deposit successful');
        } catch (error) {
            return ResponseHelper.error(res, error.message);
        }
    }
}

module.exports = new balanceController();
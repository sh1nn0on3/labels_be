const balanceService = require("../services/balance/balance.service");
const stripeService = require("../services/stripe/stripe.service");
const ResponseHelper = require("../utils/response.helper");

class balanceController {
  async deposit(req, res) {
    try {
      const { amount } = req.body;
      const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
      const session = await balanceService.deposit(userId, amount);
      return ResponseHelper.success(res, session, "Deposit successful");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async createCheckoutSession(req, res) {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      if (!amount || amount <= 0) {
        return ResponseHelper.error(res, "Invalid amount");
      }

      const session = await stripeService.createCheckoutSession(userId, amount);
      return ResponseHelper.success(
        res,
        { url: session.url },
        "Checkout session created successfully"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  async handleWebhook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      await stripeService.handleWebhook(event);
      return ResponseHelper.success(
        res,
        null,
        "Webhook processed successfully"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = new balanceController();

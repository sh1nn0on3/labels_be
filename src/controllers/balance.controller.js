const balanceService = require("../services/balance/balance.service");
const stripeService = require("../services/stripe/stripe.service");
const ResponseHelper = require("../utils/response.helper");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
      // req.body is now a Buffer when using express.raw middleware
      const payload = req.body;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      const event = stripe.webhooks.constructEvent(
        payload,
        sig,
        webhookSecret
      );
      console.log("Received webhook event:", event);

      await stripeService.handleWebhook(event);
      return ResponseHelper.success(
        res,
        null,
        "Webhook processed successfully"
      );
    } catch (error) {
      console.log("🚀 ~ balanceController ~ handleWebhook ~ error:", error)
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = new balanceController();

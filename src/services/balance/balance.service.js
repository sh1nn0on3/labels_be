const { User } = require("../../models");

class BalanceService {
  async deposit(userId, amount) {
    console.log(`Depositing ${amount} to user ${userId}'s balance`);
    return true;
  }
}

module.exports = new BalanceService();

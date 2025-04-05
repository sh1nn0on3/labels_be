const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../models/user.model');
const Transaction = require('../../models/transaction.model');

class StripeService {
    async createCheckoutSession(userId, amount) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Create or get Stripe customer
            let customerId = user.stripeCustomerId;
            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: user.email,
                    metadata: {
                        userId: userId
                    }
                });
                customerId = customer.id;
                await user.update({ stripeCustomerId: customerId });
            }

            // Create checkout session
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Balance Deposit',
                            },
                            unit_amount: Math.round(amount * 100), // Convert to cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
                metadata: {
                    userId: userId,
                    amount: amount
                }
            });

            return session;
        } catch (error) {
            throw new Error(`Error creating checkout session: ${error.message}`);
        }
    }

    async handleWebhook(event) {
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    const userId = session.metadata.userId;
                    const amount = parseFloat(session.metadata.amount);

                    // Update user balance
                    const user = await User.findByPk(userId);
                    if (user) {
                        await user.update({
                            balance: user.balance + amount
                        });

                        // Create transaction record
                        await Transaction.create({
                            userId: userId,
                            amount: amount,
                            type: 'credit',
                            description: 'Stripe payment deposit',
                            status: 'completed',
                            metadata: {
                                stripeSessionId: session.id,
                                paymentMethod: session.payment_method_types[0]
                            }
                        });
                    }
                    break;

                case 'payment_intent.succeeded':
                    // Handle successful payment
                    break;

                case 'payment_intent.payment_failed':
                    // Handle failed payment
                    break;
            }

            return { received: true };
        } catch (error) {
            throw new Error(`Error handling webhook: ${error.message}`);
        }
    }
}

module.exports = new StripeService(); 

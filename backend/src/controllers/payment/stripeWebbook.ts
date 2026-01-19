import { Request, Response } from "express";
const stripe = require("../../config/stripe");
const Payment = require("../../models/payment.model");
const Order = require("../../models/Order.model");

const stripeWebhook = async (req: Request, res:  Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /* =========================
     PAYMENT SUCCESS
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const payment = await Payment.findOne({
      checkoutSessionId: session.id,
    });

    if (payment && payment.status !== "Paid") {
      payment.status = "Paid";
      payment.transactionId = session.payment_intent;
      await payment.save();

      await Order.findByIdAndUpdate(payment.order, {
        status: "Confirmed",
      });
    }
  }

  res.json({ received: true });
};

module.exports = { stripeWebhook };

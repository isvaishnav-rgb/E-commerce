const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const stripe = require("../../config/stripe");

const createCheckoutSession = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        message: "Order already paid",
      });
    }

    const lineItems = order.items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.images,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: lineItems,

      success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${order._id}`,

      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    order.checkoutSessionId = session.id;
    await order.save();

    res.status(200).json({
      checkoutUrl: session.url,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Checkout session creation failed",
      err: err.message,
    });
  }
};

module.exports = { createCheckoutSession };

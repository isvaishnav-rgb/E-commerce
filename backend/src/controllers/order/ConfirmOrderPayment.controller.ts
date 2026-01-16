const Order = require("../../models/Order.model");

/* =========================
   CONFIRM PAYMENT
========================= */
const confirmPayment = async (req: any, res: any) => {
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ paymentIntentId });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.paymentStatus = "Paid";
  order.status = "Paid";
  await order.save();

  res.json({ message: "Payment confirmed" });
};

module.exports = { confirmPayment };

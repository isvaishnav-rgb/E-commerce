const Order = require("../../models/Order.model");

const getOrderStatus = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    status: order.status,
    paymentStatus: order.paymentStatus,
  });
};

module.exports = { getOrderStatus };

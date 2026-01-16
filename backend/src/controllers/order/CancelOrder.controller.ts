const Order = require("../../models/Order.model");

const cancelOrder = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (["Shipped", "Delivered"].includes(order.status)) {
    return res.status(400).json({
      message: "Order cannot be cancelled",
    });
  }

  order.status = "Cancelled";
  await order.save();

  res.json({ message: "Order cancelled" });
};

module.exports = { cancelOrder };

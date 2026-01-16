const Order = require("../../models/Order.model");

const returnOrder = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.status !== "Delivered") {
    return res.status(400).json({
      message: "Only delivered orders can be returned",
    });
  }

  order.status = "Returned";
  await order.save();

  res.json({ message: "Return initiated" });
};

module.exports = { returnOrder };

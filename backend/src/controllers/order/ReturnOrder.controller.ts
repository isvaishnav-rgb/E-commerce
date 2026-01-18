const Order = require("../../models/Order.model");
const Payment = require("../../models/payment.model");

const returnOrder = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate("payment");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    /* =====================
       OWNERSHIP CHECK
    ===================== */
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to return this order",
      });
    }

    /* =====================
       STATUS CHECK
    ===================== */
    if (order.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    /* =====================
       PAYMENT CHECK
    ===================== */
    if (!order.payment || order.payment.status !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "Only paid orders can be returned",
      });
    }

    /* =====================
       RETURN ORDER
    ===================== */
    order.status = "Returned";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Return initiated successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Return failed",
      error: err.message,
    });
  }
};

module.exports = { returnOrder };

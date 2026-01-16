const Order = require("../../models/Order.model");

/* ===============================
   UPDATE ORDER STATUS (ADMIN)
=============================== */
const updateOrderStatus = async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Created",
      "Paid",
      "Cancelled",
      "Shipped",
      "Delivered",
      "Returned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to update order status",
      err: err.message,
    });
  }
};

/* ===============================
   UPDATE PAYMENT STATUS (ADMIN)
=============================== */
const updatePaymentStatus = async (req: any, res: any) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = ["Pending", "Paid", "Failed"];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    // Auto-sync order status if payment is paid
    if (paymentStatus === "Paid" && order.status === "Pending") {
      order.status = "Paid";
    }

    await order.save();

    res.status(200).json({
      message: "Payment status updated successfully",
      order,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to update payment status",
      err: err.message,
    });
  }
};

module.exports = {
  updateOrderStatus,
  updatePaymentStatus,
};

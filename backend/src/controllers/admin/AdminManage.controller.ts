const Order = require("../../models/Order.model");

/* ===============================
   UPDATE ORDER STATUS
=============================== */
const updateOrderStatus = async (req: any, res: any) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Prevent updates after cancellation
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled order cannot be updated",
      });
    }

    order.orderStatus = orderStatus;

    // Auto-sync payment status
    if (orderStatus === "Paid") {
      order.paymentStatus = "Success";
    }

    if (orderStatus === "Cancelled") {
      order.paymentStatus = "Failed";
    }

    await order.save();

    res.json({
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
   UPDATE PAYMENT STATUS
=============================== */
const updatePaymentStatus = async (req: any, res: any) => {
  try {
    const { paymentStatus } = req.body;

    const allowedPayments = ["Pending", "Success", "Failed"];

    if (!allowedPayments.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    // Auto update order status
    if (paymentStatus === "Success") {
      order.orderStatus = "Paid";
    }

    if (paymentStatus === "Failed") {
      order.orderStatus = "Pending";
    }

    await order.save();

    res.json({
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

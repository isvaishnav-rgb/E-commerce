import { Request, Response } from "express";
const Order = require("../../models/Order.model");

const updateOrderStatus = async (req: Request, res:  Response) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = [
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: err.message,
    });
  }
};

module.exports = { updateOrderStatus };

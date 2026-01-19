import { Request, Response } from "express";
const Order = require("../../models/Order.model");

const getMyOrders = async (req: Request, res:  Response) => {
  try {
    const userId = req?.user?.id;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("payment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

module.exports = { getMyOrders };

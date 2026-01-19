"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model");
const getOrderById = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const orderId = req?.params.id;
        const order = await Order.findById(orderId)
            .populate("items.product")
            .populate("payment");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        if (order.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: err.message,
        });
    }
};
module.exports = { getOrderById };

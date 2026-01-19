"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model");
const updateOrderStatus = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update order",
            error: err.message,
        });
    }
};
module.exports = { updateOrderStatus };

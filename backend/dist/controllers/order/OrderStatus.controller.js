"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model");
const getOrderStatus = async (req, res) => {
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
                message: "Not authorized to view this order",
            });
        }
        res.status(200).json({
            success: true,
            orderStatus: order.status,
            paymentStatus: order.payment ? order.payment.status : "Pending",
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order status",
            error: err.message,
        });
    }
};
module.exports = { getOrderStatus };

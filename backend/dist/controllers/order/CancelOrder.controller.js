"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model");
const Payment = require("../../models/payment.model");
const cancelOrder = async (req, res) => {
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
                message: "Not authorized to cancel this order",
            });
        }
        /* =====================
           STATUS CHECK
        ===================== */
        if (["Shipped", "Delivered", "Returned"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled at this stage",
            });
        }
        /* =====================
           PAYMENT CHECK
        ===================== */
        if (order.payment && order.payment.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Paid orders cannot be cancelled. Please request a return/refund.",
            });
        }
        /* =====================
           CANCEL ORDER
        ===================== */
        order.status = "Cancelled";
        await order.save();
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Order cancellation failed",
            error: err.message,
        });
    }
};
module.exports = { cancelOrder };

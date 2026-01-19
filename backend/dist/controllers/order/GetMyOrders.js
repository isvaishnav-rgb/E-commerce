"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model").default;
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate("items.product")
            .populate("payment")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: err.message,
        });
    }
};
module.exports = { getMyOrders };

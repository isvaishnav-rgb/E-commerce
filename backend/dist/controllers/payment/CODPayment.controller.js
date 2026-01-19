"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Payment = require("../../models/payment.model").default;
const Order = require("../../models/Order.model").default;
/* ===============================
   CREATE COD PAYMENT
=============================== */
const createCODPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if order belongs to user
        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized access to order" });
        }
        // Check if payment already exists
        const existingPayment = await Payment.findOne({ order: orderId });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment already exists for this order" });
        }
        // Create COD payment
        const payment = await Payment.create({
            user: userId,
            order: orderId,
            amount: order.totalAmount,
            method: "COD",
            status: "Pending",
            transactionId: `COD_${Date.now()}_${orderId.slice(-6)}`
        });
        res.status(201).json({
            message: "COD payment created successfully",
            payment
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to create COD payment",
            error: err.message
        });
    }
};
module.exports = {
    createCODPayment
};

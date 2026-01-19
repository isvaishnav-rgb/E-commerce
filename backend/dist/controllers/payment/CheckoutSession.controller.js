"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order = require("../../models/Order.model").default;
const Payment = require("../../models/payment.model").default;
const stripe = require("../../config/stripe");
const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;
        /* =====================
           FIND ORDER
        ===================== */
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        }).populate("items.product");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        /* =====================
           CHECK EXISTING PAYMENT
        ===================== */
        let payment = await Payment.findOne({ order: order._id });
        if (payment && payment.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Order already paid",
            });
        }
        /* =====================
           STRIPE LINE ITEMS
        ===================== */
        const lineItems = order.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.name,
                    images: item.product.images,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));
        /* =====================
           CREATE STRIPE SESSION
        ===================== */
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${order._id}`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });
        /* =====================
           CREATE / UPDATE PAYMENT
        ===================== */
        if (!payment) {
            payment = await Payment.create({
                user: userId,
                order: order._id,
                amount: order.totalAmount,
                method: "Stripe",
                status: "Pending",
                checkoutSessionId: session.id,
            });
            order.payment = payment._id;
            await order.save();
        }
        else {
            payment.checkoutSessionId = session.id;
            await payment.save();
        }
        res.status(200).json({
            success: true,
            checkoutUrl: session.url,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Checkout session creation failed",
            error: err.message,
        });
    }
};
module.exports = { createCheckoutSession };

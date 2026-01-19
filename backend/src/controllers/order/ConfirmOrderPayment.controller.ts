import { Request, Response } from "express";
const Payment = require("../../models/Payment.model");
const Order = require("../../models/Order.model");

/* =========================
   CONFIRM PAYMENT
========================= */
const confirmPayment = async (req: Request, res:  Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent id required",
      });
    }

    /* =====================
       FIND PAYMENT
    ===================== */
    const payment = await Payment.findOne({
      checkoutSessionId: paymentIntentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    /* =====================
       UPDATE PAYMENT
    ===================== */
    payment.status = "Paid";
    payment.transactionId = paymentIntentId;
    await payment.save();

    /* =====================
       UPDATE ORDER
    ===================== */
    const order = await Order.findById(payment.order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = "Confirmed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
      error: err.message,
    });
  }
};

module.exports = { confirmPayment };

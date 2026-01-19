"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { createCheckoutSession, } = require("../controllers/payment/CheckoutSession.controller");
const { getPaymentStatus, } = require("../controllers/payment/getPaymentStatus");
const { stripeWebhook, } = require("../controllers/payment/stripeWebbook");
const { createCODPayment, } = require("../controllers/payment/CODPayment.controller");
const AuthJwt = require("../middlewares/auth/AuthJWT");
const router = express.Router();
/* =========================
   PAYMENT ROUTES
========================= */
// Create Stripe checkout session
router.post("/checkout/:orderId", AuthJwt, createCheckoutSession);
// Create COD payment
router.post("/cod", AuthJwt, createCODPayment);
// Get payment status (polling / refresh)
router.get("/status/:orderId", AuthJwt, getPaymentStatus);
// Stripe webhook (NO protect, NO express.json)
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);
module.exports = router;

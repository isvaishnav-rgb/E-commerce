const express = require("express");
const router = express.Router();

const AuthJWT = require("../middlewares/auth/AuthJWT");

const { placeOrder } = require("../controllers/order/PlaceOrder.controller");
const {
  confirmPayment,
} = require("../controllers/order/ConfirmOrderPayment.controller");
const { cancelOrder } = require("../controllers/order/CancelOrder.controller");
const { returnOrder } = require("../controllers/order/ReturnOrder.controller");
const {
  getOrderStatus,
} = require("../controllers/order/OrderStatus.controller");

const {createCheckoutSession} = require("../controllers/order/CheckoutSession.controller")

router.post("/", AuthJWT, placeOrder);
router.get("/confirm-payment", AuthJWT, confirmPayment);
router.get("/:id/cancel", AuthJWT, cancelOrder);
router.get("/:id/return", AuthJWT, returnOrder);
router.get("/:id/status", AuthJWT, getOrderStatus);
router.get("/checkout/:orderId", AuthJWT, createCheckoutSession)

module.exports = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { placeOrder, } = require("../controllers/order/PlaceOrder.controller");
const { getMyOrders, } = require("../controllers/order/GetMyOrders");
const { getOrderById, } = require("../controllers/order/GetOrderById");
const { cancelOrder, } = require("../controllers/order/CancelOrder.controller");
const { returnOrder, } = require("../controllers/order/ReturnOrder.controller");
const AuthJwt = require("../middlewares/auth/AuthJWT");
const router = express.Router();
/* =========================
   ORDER ROUTES
========================= */
// Place order
router.post("/", AuthJwt, placeOrder);
// Get my orders
router.get("/my", AuthJwt, getMyOrders);
// Get single order
router.get("/:id", AuthJwt, getOrderById);
// Cancel order
router.put("/:id/cancel", AuthJwt, cancelOrder);
// Return order
router.put("/:id/return", AuthJwt, returnOrder);
module.exports = router;

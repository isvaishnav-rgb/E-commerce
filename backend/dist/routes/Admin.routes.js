"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const { getProviderActivities, reviewProviderApplication, approveProviderApplication, rejectProviderApplication, addServiceProvider, removeServiceProvider, getAllUsers, getAllApplications, getApplicationById, getAllProducts, reviewProduct, removeUser, getAllOrders, } = require("../controllers/admin/admin.controller");
const { updateOrderStatus, updatePaymentStatus, } = require("../controllers/admin/adminManage.controller");
const protect = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");
/* ===============================
   PROVIDER ACTIVITIES
=============================== */
router.get("/providers/activity", protect, allowRoles("admin"), getProviderActivities);
/* ===============================
   APPROVE / REJECT APPLICATION
=============================== */
router.put("/provider-applications/:id", protect, allowRoles("admin"), reviewProviderApplication);
router.put("/provider-applications/:id/approve", protect, allowRoles("admin"), approveProviderApplication);
router.put("/provider-applications/:id/reject", protect, allowRoles("admin"), rejectProviderApplication);
/* ===============================
   ADD PROVIDER
=============================== */
router.post("/providers", protect, allowRoles("admin"), addServiceProvider);
/* ===============================
   REMOVE PROVIDER
=============================== */
router.delete("/providers/:id", protect, allowRoles("admin"), removeServiceProvider);
router.put("/orders/:id/status", protect, allowRoles("admin"), updateOrderStatus);
/* ===============================
   UPDATE PAYMENT STATUS
=============================== */
router.put("/orders/:id/payment", protect, allowRoles("admin"), updatePaymentStatus);
/* ===============================
   USER MANAGEMENT
=============================== */
router.get("/users", protect, allowRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, allowRoles("admin"), removeUser);
/* ===============================
   APPLICATION MANAGEMENT
=============================== */
router.get("/applications", protect, allowRoles("admin"), getAllApplications);
router.get("/applications/:id", protect, allowRoles("admin"), getApplicationById);
/* ===============================
   PRODUCT MANAGEMENT
=============================== */
router.get("/products", protect, allowRoles("admin"), getAllProducts);
router.put("/products/:id/review", protect, allowRoles("admin"), reviewProduct);
/* ===============================
   ORDER MANAGEMENT
=============================== */
router.get("/orders", protect, allowRoles("admin"), getAllOrders);
router.put("/orders/:id/status", protect, allowRoles("admin"), updateOrderStatus);
module.exports = router;

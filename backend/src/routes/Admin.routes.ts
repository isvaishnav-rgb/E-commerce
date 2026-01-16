const express = require("express");
const router = express.Router();

const {
  getProviderActivities,
  reviewProviderApplication,
  addServiceProvider,
  removeServiceProvider,
} = require("../controllers/admin/admin.controller");

const {
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/admin/AdminManage.controller");

const protect = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");

/* ===============================
   PROVIDER ACTIVITIES
=============================== */
router.get(
  "/providers/activity",
  protect,
  allowRoles("admin"),
  getProviderActivities
);

/* ===============================
   APPROVE / REJECT APPLICATION
=============================== */
router.put(
  "/provider-applications/:id",
  protect,
  allowRoles("admin"),
  reviewProviderApplication
);

/* ===============================
   ADD PROVIDER
=============================== */
router.post(
  "/providers",
  protect,
  allowRoles("admin"),
  addServiceProvider
);

/* ===============================
   REMOVE PROVIDER
=============================== */
router.delete(
  "/providers/:id",
  protect,
  allowRoles("admin"),
  removeServiceProvider
);

router.put(
  "/orders/:id/status",
  protect,
  allowRoles("admin"),
  updateOrderStatus
);

/* ===============================
   UPDATE PAYMENT STATUS
=============================== */
router.put(
  "/orders/:id/payment",
  protect,
  allowRoles("admin"),
  updatePaymentStatus
);

module.exports = router;

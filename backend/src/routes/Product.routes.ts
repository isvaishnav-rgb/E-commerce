const express = require("express");
const router = express.Router();

/* =====================
   Controllers
===================== */
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getActiveProducts
} = require("../controllers/product/product.conroller");

/* =====================
   Middlewares
===================== */
const authJWT = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");
const {
  isProductOwnerOrAdmin,
} = require("../middlewares/auth/ProductOwner");

/* =====================
   CREATE PRODUCT
===================== */
const upload = require("../middlewares/upload/KycUpload");

router.post(
  "/create",
  authJWT,
  allowRoles("admin", "provider"),
  upload.array("images", 5), // max 5 images
  createProduct
);

/* =====================
   UPDATE PRODUCT
===================== */
router.put(
  "/:id",
  authJWT,
  allowRoles("admin", "provider"),
  isProductOwnerOrAdmin,
  upload.array("images", 5),
  updateProduct
);


/* =====================
   DELETE PRODUCT
===================== */
router.delete(
  "/:id",
  authJWT,
  allowRoles("admin", "provider"),
  isProductOwnerOrAdmin,
  deleteProduct
);

router.get(
  "/my-products",
  authJWT,
  allowRoles("admin", "provider"),
  getMyProducts
);

/* =====================
   PUBLIC PRODUCTS
===================== */
router.get("/", getActiveProducts);

module.exports = router;

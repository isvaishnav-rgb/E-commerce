const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getActiveProducts,
  toggleCart,
  toggleWishlist
} = require("../controllers/product/product.conroller");

const authJWT = require("../middlewares/auth/AuthJWT");
const { allowRoles } = require("../middlewares/auth/RoleAuth");
const {
  isProductOwnerOrAdmin,
} = require("../middlewares/auth/ProductOwner");

const upload = require("../middlewares/upload/Upload");

router.post("/create",authJWT,allowRoles("admin", "provider"),upload.array("images", 5),createProduct);
router.put("/:id",authJWT,allowRoles("admin", "provider"),isProductOwnerOrAdmin,upload.array("images", 5),updateProduct);
router.delete("/:id",authJWT,allowRoles("admin", "provider"),isProductOwnerOrAdmin,deleteProduct);
router.get("/my-products",authJWT,allowRoles("admin", "provider"),getMyProducts);
router.get("/", getActiveProducts);
router.post("/cart/toggle", authJWT, toggleCart);
router.post("/wishlist/toggle", authJWT, toggleWishlist);

module.exports = router;

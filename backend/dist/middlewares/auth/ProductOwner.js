"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Product = require("../../models/Product.model").default;
const isProductOwnerOrAdmin = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Admin → full access
        if (req.user && req.user.role === "admin") {
            return next();
        }
        // Provider → own product only
        if (req.user &&
            req.user.role === "provider" &&
            product.createdBy.toString() === req.user.id.toString()) {
            return next();
        }
        return res.status(403).json({
            message: "You can access only your own products",
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Authorization failed",
            err: err.message,
        });
    }
};
module.exports = { isProductOwnerOrAdmin };

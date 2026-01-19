"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProductOwnerOrAdmin = void 0;
const Product = require("../../models/Product.model");
const isProductOwnerOrAdmin = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.user?.role === "admin") {
            return next();
        }
        if (req.user?.role === "provider" &&
            product.createdBy.toString() === req.user.id.toString()) {
            return next();
        }
        return res.status(403).json({
            message: "You can access only your own products",
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Authorization failed",
                error: err.message,
            });
        }
        return res.status(500).json({
            message: "Authorization failed",
        });
    }
};
exports.isProductOwnerOrAdmin = isProductOwnerOrAdmin;

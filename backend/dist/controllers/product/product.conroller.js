"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCart = exports.toggleWishlist = exports.getActiveProducts = exports.getMyProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product = require("../../models/Product.model");
const uploadBufferToCloudinary = require("../../utils/uploadToCloudinary");
const User = require("../../models/User.model");
const mongoose = require("mongoose");
/* =====================
   CREATE PRODUCT
===================== */
const createProduct = async (req, res) => {
    try {
        let imageUrls = [];
        if (req.files?.length) {
            imageUrls = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file.buffer, "products")));
        }
        const product = await Product.create({
            ...req.body,
            images: imageUrls,
            createdBy: req?.user?.id,
            createdByRole: req?.user?.role,
        });
        res.status(201).json({ message: "Product created", product });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createProduct = createProduct;
/* =====================
   UPDATE PRODUCT
===================== */
const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // If new images are uploaded
        if (req.files && req?.files?.length > 0) {
            const imageUrls = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file.buffer, "products")));
            updateData.$push = {
                images: { $each: imageUrls },
            };
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({
            message: "Product updated",
            product,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Update product failed",
            err: err.message,
        });
    }
};
exports.updateProduct = updateProduct;
/* =====================
   DELETE PRODUCT
===================== */
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {
            isDeleted: true,
        });
        res.json({ message: "Product deleted" });
    }
    catch (err) {
        res.status(500).json({
            message: "Delete product failed",
            err: err.message,
        });
    }
};
exports.deleteProduct = deleteProduct;
//get particular service provider product 
const getMyProducts = async (req, res) => {
    try {
        let filter = { isDeleted: false };
        // Provider → only own products
        if (req?.user?.role === "provider") {
            filter.createdBy = req?.user?.id;
        }
        // Admin → all products (no createdBy filter)
        const products = await Product.find(filter)
            .sort({ createdAt: -1 });
        res.json({
            message: "Products fetched successfully",
            count: products.length,
            products,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: err.message,
        });
    }
};
exports.getMyProducts = getMyProducts;
const getActiveProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        /* ------------------------
           BASE QUERY (IMPORTANT)
        ------------------------- */
        const query = {
            status: "Active",
            isDeleted: false,
        };
        /* 🔍 Search by product name */
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        /* 🏷️ Filter by category */
        if (category) {
            query.category = category;
        }
        /* 💰 Filter by price range */
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        /* ⬇️ Sorting */
        let sortOption = { createdAt: -1 };
        if (sort === "price_asc")
            sortOption = { price: 1 };
        if (sort === "price_desc")
            sortOption = { price: -1 };
        if (sort === "latest")
            sortOption = { createdAt: -1 };
        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);
        const totalPages = Math.ceil(totalProducts / limitNum);
        res.status(200).json({
            message: "Active products fetched successfully",
            products,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalProducts,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch active products",
            error: err.message,
        });
    }
};
exports.getActiveProducts = getActiveProducts;
const toggleWishlist = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const { productId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isProductInWishlist = user.wishlist.some((id) => id.toString() === productId);
        if (isProductInWishlist) {
            // REMOVE
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        }
        else {
            // ADD
            user.wishlist.push(productId);
        }
        await user.save();
        res.json({
            message: isProductInWishlist
                ? "Product removed from wishlist"
                : "Product added to wishlist",
            wishlist: user.wishlist,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Wishlist toggle failed",
            error: err.message,
        });
    }
};
exports.toggleWishlist = toggleWishlist;
const toggleCart = async (req, res) => {
    try {
        const userId = req?.user?.id;
        const { productId, quantity = 1 } = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cartIndex = user.cart.findIndex((item) => item.product.toString() === productId);
        /* =====================
           CART LOGIC
        ===================== */
        // REMOVE if quantity = 0
        if (cartIndex > -1 && quantity === 0) {
            user.cart.splice(cartIndex, 1);
        }
        // UPDATE quantity if product exists
        else if (cartIndex > -1 && quantity > 0) {
            user.cart[cartIndex].quantity = quantity;
        }
        // ADD new product
        else if (cartIndex === -1 && quantity > 0) {
            user.cart.push({
                product: productId,
                quantity,
            });
        }
        await user.save();
        res.json({
            message: quantity === 0
                ? "Product removed from cart"
                : cartIndex > -1
                    ? "Cart quantity updated"
                    : "Product added to cart",
            cart: user.cart,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Cart update failed",
            error: err.message,
        });
    }
};
exports.toggleCart = toggleCart;

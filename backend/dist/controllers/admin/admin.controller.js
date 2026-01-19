"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../../models/User.model");
const Product = require("../../models/Product.model").default;
const Order = require("../../models/Order.model").default;
const ServiceProviderApplication = require("../../models/ServiceProviderApplication.model").default;
/* ===============================
   GET ALL PROVIDER ACTIVITIES
=============================== */
const getProviderActivities = async (req, res) => {
    try {
        const providers = await User.find({ role: "provider" }).select("name email phone isActive");
        const data = await Promise.all(providers.map(async (provider) => {
            const products = await Product.find({
                createdBy: provider._id,
                isDeleted: false,
            }).countDocuments();
            const orders = await Order.find({
                "items.product": { $exists: true },
            }).countDocuments();
            return {
                provider,
                totalProducts: products,
                totalOrders: orders,
            };
        }));
        res.json({
            message: "Provider activities fetched successfully",
            data
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch provider activity",
            err: err.message,
        });
    }
};
/* ===============================
   APPROVE / REJECT APPLICATION
=============================== */
const reviewProviderApplication = async (req, res) => {
    try {
        const { status, adminRemark } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const application = await ServiceProviderApplication.findById(req.params.id).populate("user");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        application.status = status;
        application.adminRemark = adminRemark;
        application.reviewedAt = new Date();
        await application.save();
        if (status === "Approved") {
            await User.findByIdAndUpdate(application.user._id, {
                role: "provider",
                isActive: true,
            });
        }
        res.json({
            message: `Application ${status}`,
            application,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Review failed",
            err: err.message,
        });
    }
};
/* ===============================
   APPROVE PROVIDER APPLICATION
=============================== */
const approveProviderApplication = async (req, res) => {
    try {
        const { adminRemark } = req.body;
        const applicationId = req.params.id;
        const application = await ServiceProviderApplication.findById(applicationId).populate("user");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.status !== "Pending") {
            return res.status(400).json({ message: "Application already reviewed" });
        }
        application.status = "Approved";
        application.adminRemark = adminRemark || "Application approved";
        application.reviewedAt = new Date();
        await application.save();
        await User.findByIdAndUpdate(application.user._id, {
            role: "provider",
            isActive: true,
        });
        res.json({
            message: "Application approved successfully",
            application,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to approve application",
            error: err.message,
        });
    }
};
/* ===============================
   REJECT PROVIDER APPLICATION
=============================== */
const rejectProviderApplication = async (req, res) => {
    try {
        const { adminRemark } = req.body;
        const applicationId = req.params.id;
        const application = await ServiceProviderApplication.findById(applicationId).populate("user");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        if (application.status !== "Pending") {
            return res.status(400).json({ message: "Application already reviewed" });
        }
        application.status = "Rejected";
        application.adminRemark = adminRemark || "Application rejected";
        application.reviewedAt = new Date();
        await application.save();
        res.json({
            message: "Application rejected successfully",
            application,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to reject application",
            error: err.message,
        });
    }
};
/* ===============================
   ADD SERVICE PROVIDER (ADMIN)
=============================== */
const addServiceProvider = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
            });
        }
        // 1️⃣ User check
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // 2️⃣ Role check
        if (user.role === "provider" || user.role === "admin") {
            return res.status(400).json({
                message: "User is already a provider or admin",
            });
        }
        // 3️⃣ User must be verified
        if (!user.verified) {
            return res.status(400).json({
                message: "User should be verified first",
            });
        }
        // ✅ 4️⃣ MAIN CHECK (Service Provider Application)
        const application = await ServiceProviderApplication.findOne({
            user: userId,
            status: "Pending",
        });
        if (!application) {
            return res.status(400).json({
                message: "User has not applied for service provider or application is not pending",
            });
        }
        // 5️⃣ Promote user
        user.role = "provider";
        user.isActive = true;
        user.verified = true;
        await user.save();
        // 6️⃣ Update application status
        application.status = "Approved";
        application.reviewedAt = new Date();
        await application.save();
        res.status(200).json({
            message: "User successfully promoted to service provider",
            user,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to add service provider",
            err: err.message,
        });
    }
};
/* ===============================
   REMOVE SERVICE PROVIDER
=============================== */
const removeServiceProvider = async (req, res) => {
    try {
        const providerId = req.params.id;
        // 1️⃣ Find provider
        const provider = await User.findById(providerId);
        if (!provider || provider.role !== "provider") {
            return res.status(404).json({
                message: "Provider not found",
            });
        }
        // 2️⃣ Deactivate provider
        provider.isActive = false;
        provider.role = "user"; // 🔁 optional but RECOMMENDED
        await provider.save();
        // 3️⃣ Update ServiceProviderApplication
        await ServiceProviderApplication.findOneAndUpdate({ user: providerId }, {
            status: "Rejected", // or "Removed" if you add new enum
            adminRemark: "Removed by admin",
            reviewedAt: new Date(),
        });
        res.json({
            message: "Service provider removed successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to remove provider",
            err: err.message,
        });
    }
};
/* ===============================
   GET ALL USERS (ADMIN)
=============================== */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("name email phone role verified isActive createdAt")
            .sort({ createdAt: -1 });
        res.json({
            message: "Users fetched successfully",
            users
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: err.message,
        });
    }
};
/* ===============================
   GET ALL APPLICATIONS (ADMIN)
=============================== */
const getAllApplications = async (req, res) => {
    try {
        const applications = await ServiceProviderApplication.find()
            .populate("user", "name email phone")
            .sort({ appliedAt: -1 });
        console.log("Applications found:", applications.length);
        console.log("Applications data:", applications);
        res.json({
            message: "Applications fetched successfully",
            applications
        });
    }
    catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({
            message: "Failed to fetch applications",
            error: err.message
        });
    }
};
/* ===============================
   GET APPLICATION BY ID (ADMIN)
=============================== */
const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await ServiceProviderApplication.findById(applicationId)
            .populate("user", "name email phone role verified isActive createdAt");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.json({
            message: "Application details fetched successfully",
            application
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch application details",
            error: err.message
        });
    }
};
/* ===============================
   GET ALL PRODUCTS (ADMIN)
=============================== */
const getAllProducts = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = { isDeleted: false };
        if (status) {
            filter.status = status;
        }
        const products = await Product.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        res.json({
            message: "Products fetched successfully",
            products
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: err.message
        });
    }
};
/* ===============================
   APPROVE/REJECT PRODUCT (ADMIN)
=============================== */
const reviewProduct = async (req, res) => {
    try {
        const { status } = req.body;
        const productId = req.params.id;
        if (!["Active", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.status = status;
        await product.save();
        res.json({
            message: `Product ${status.toLowerCase()}`,
            product
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Product review failed",
            error: err.message
        });
    }
};
/* ===============================
   REMOVE USER (ADMIN)
=============================== */
const removeUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot remove admin user" });
        }
        user.isActive = false;
        await user.save();
        res.json({ message: "User removed successfully" });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to remove user",
            error: err.message
        });
    }
};
/* ===============================
   GET ALL ORDERS (ADMIN)
=============================== */
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email phone")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 });
        res.json({
            message: "Orders fetched successfully",
            orders
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to fetch orders",
            error: err.message
        });
    }
};
/* ===============================
   UPDATE ORDER STATUS (ADMIN)
=============================== */
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        if (!['Pending', 'Confirmed', 'Cancelled', 'Shipped', 'Delivered', 'Returned'].includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();
        res.json({
            message: "Order status updated successfully",
            order
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Failed to update order status",
            error: err.message
        });
    }
};
module.exports = {
    getProviderActivities,
    reviewProviderApplication,
    approveProviderApplication,
    rejectProviderApplication,
    addServiceProvider,
    removeServiceProvider,
    getAllUsers,
    getAllApplications,
    getApplicationById,
    getAllProducts,
    reviewProduct,
    removeUser,
    getAllOrders,
    updateOrderStatus
};

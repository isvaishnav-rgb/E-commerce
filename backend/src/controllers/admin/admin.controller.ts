const User = require("../../models/User.model");
const Product = require("../../models/Product.model");
const Order = require("../../models/Order.model");
const ServiceProviderApplication = require("../../models/ServiceProviderApplication.model");

/* ===============================
   GET ALL PROVIDER ACTIVITIES
=============================== */
const getProviderActivities = async (req: any, res: any) => {
  try {
    const providers = await User.find({ role: "provider" }).select(
      "name email phone isActive"
    );

    const data = await Promise.all(
      providers.map(async (provider: any) => {
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
      })
    );

    res.json(data);
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to fetch provider activity",
      err: err.message,
    });
  }
};

/* ===============================
   APPROVE / REJECT APPLICATION
=============================== */
const reviewProviderApplication = async (req: any, res: any) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await ServiceProviderApplication.findById(
      req.params.id
    ).populate("user");

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
  } catch (err: any) {
    res.status(500).json({
      message: "Review failed",
      err: err.message,
    });
  }
};

/* ===============================
   ADD SERVICE PROVIDER (ADMIN)
=============================== */
const addServiceProvider = async (req: any, res: any) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const provider = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "provider",
      verified: true,
      isActive: true,
    });

    res.status(201).json({
      message: "Service provider added",
      provider,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to add provider",
      err: err.message,
    });
  }
};

/* ===============================
   REMOVE SERVICE PROVIDER
=============================== */
const removeServiceProvider = async (req: any, res: any) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isActive = false;
    await provider.save();

    res.json({
      message: "Service provider removed",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to remove provider",
      err: err.message,
    });
  }
};

module.exports = {
  getProviderActivities,
  reviewProviderApplication,
  addServiceProvider,
  removeServiceProvider,
};

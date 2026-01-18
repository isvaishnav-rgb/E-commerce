const User = require("../../models/User.model");
const Product = require("../../models/Product.model");
const Order = require("../../models/Order.model");
const ServiceProviderApplication = require("../../models/ServiceProviderApplication.model").default;

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
        message:
          "User has not applied for service provider or application is not pending",
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
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to add service provider",
      err: err.message,
    });
  }
};


/* ===============================
   REMOVE SERVICE PROVIDER
=============================== */
const removeServiceProvider = async (req: any, res: any) => {
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
    await ServiceProviderApplication.findOneAndUpdate(
      { user: providerId },
      {
        status: "Rejected", // or "Removed" if you add new enum
        adminRemark: "Removed by admin",
        reviewedAt: new Date(),
      }
    );

    res.json({
      message: "Service provider removed successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to remove provider",
      err: err.message,
    });
  }
};

/* ===============================
   GET ALL USERS (ADMIN)
=============================== */
const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find()
      .select("name email phone role verified isActive createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};


module.exports = {
  getProviderActivities,
  reviewProviderApplication,
  addServiceProvider,
  removeServiceProvider,
  getAllUsers
};

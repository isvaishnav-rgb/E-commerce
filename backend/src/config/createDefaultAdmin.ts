const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;

    const existingAdmin = await User.findOne({
      $or: [
        { email: adminEmail },
        { role: "admin" }
      ]
    });

    if (existingAdmin) {
      console.log("✅ Default admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_ADMIN_PASSWORD,
      10
    );

    const admin = await User.create({
      name: process.env.DEFAULT_ADMIN_NAME,
      email: adminEmail,
      password: hashedPassword,
      phone: "9999999999",
      role: "admin",
      verified: true,
      isActive: true,
      isUserLoggedIn: false,
      refreshToken: ""
    });

    console.log("✅ Default admin created successfully");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123"}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error creating default admin:", error.message);
    }
  }
};

module.exports = createDefaultAdmin;
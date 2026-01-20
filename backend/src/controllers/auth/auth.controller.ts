import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const User = require("../../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const { sendOtpEmail } = require("../../utils/mailer");
const crypto = require("crypto");
const {sendEmail} = require("../../utils/mailer");

/* =====================s
   HELPERS
===================== */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =====================
   SIGNUP
===================== */
const signup = async (req: Request, res:  Response) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      verified: false,
      refreshToken: ""
    });

    await sendOtpEmail(email, otp);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;

    res.status(201).json({
      message: "Signup successful. OTP sent to email.",
      user : userObj
    });
  } catch (err: any) {
    res.status(500).json({ message: "Signup failed", err: err.message });
  }
};

/* =====================
   VERIFY OTP
===================== */
const verifyOtp = async (req: Request, res:  Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = "";

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isUserLoggedIn = true;
    await user.save();

    res.json({
      message: "OTP verified",
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    res.status(500).json({ message: "OTP verification failed", err: err.message });
  }
};

/* =====================
   LOGIN
===================== */
const login = async (req: Request, res:  Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isUserLoggedIn = true;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Login failed", err: err.message });
  }
};

/* =====================
   REFRESH TOKEN
===================== */
const refreshToken = async (req: Request, res:  Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = require("jsonwebtoken").verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Token refresh failed" });
  }
};

/* =====================
   LOGOUT
===================== */
const logout = async (req: Request, res:  Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      // Token already invalid → still treat as logout success
      return res.json({ message: "Logged out successfully" });
    }

    user.refreshToken = "";
    user.isUserLoggedIn = false;
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Logout failed" , err: err.message });
  }
};

//update Password

const changePassword = async (req: Request, res:  Response) => {
  try {
    const userId = req?.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // 1️⃣ Get user with password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2️⃣ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password & invalidate sessions
    user.password = hashedPassword;
    user.refreshToken = ""; // 🔥 logout from all devices
    user.isUserLoggedIn = false;

    await user.save();

    res.json({
      message: "Password changed successfully. Please login again.",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to change password",
      err: err.message,
    });
  }
};

/* =====================
   UPDATE USER PROFILE
===================== */
const updateProfile = async (req: Request, res:  Response) => {
  try {
    const userId = req?.user?.id;

    const allowedUpdates = [
      "name",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const updates: any = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update",
      });
    }

    // Optional: phone uniqueness check
    if (updates.phone) {
      const exists = await User.findOne({
        phone: updates.phone,
        _id: { $ne: userId },
      });

      if (exists) {
        return res.status(400).json({
          message: "Phone number already in use",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password -refreshToken -otp");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to update profile",
      err: err.message,
    });
  }
};

const me = async (req: Request, res:  Response) => {
  const user = await User.findById(req?.user?.id)
    .select("-password -refreshToken -otp");

  res.json(user);
};

const forgotPassword = async (req: Request, res:  Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Security: don't reveal user existence
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    /* ===============================
       GENERATE TOKEN
    =============================== */
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    /* ===============================
       RESET URL
    =============================== */
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: message,
    });

    res.json({
      message: "Password reset link sent to email",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Forgot password failed",
      error: err.message,
    });
  }
};

const resetPassword = async (req: Request, res:  Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Reset password failed",
      error: err.message,
    });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  refreshToken,
  logout,
  changePassword,
  updateProfile,
  forgotPassword,
   resetPassword,
  me 
};

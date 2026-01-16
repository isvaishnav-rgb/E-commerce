const bcrypt = require("bcryptjs");
const User = require("../../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const { sendOtpEmail } = require("../../utils/mailer");

/* =====================s
   HELPERS
===================== */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =====================
   SIGNUP
===================== */
const signup = async (req: any, res: any) => {
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
const verifyOtp = async (req: any, res: any) => {
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
const login = async (req: any, res: any) => {
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
const refreshToken = async (req: any, res: any) => {
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
const logout = async (req: any, res: any) => {
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

module.exports = {
  signup,
  login,
  verifyOtp,
  refreshToken,
  logout
};

const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyOtp,
  refreshToken,
  logout,
  updateProfile,
  changePassword
} = require("../controllers/auth/auth.controller");

const authJWT = require("../middlewares/auth/AuthJWT");
const {  signupValidation } = require("../middlewares/auth/Validation")

router.post("/signup",signupValidation, signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/me", authJWT, (req: any, res: any) => {
  res.json(req.user);
});

router.put(
  "/profile",
  authJWT,
  updateProfile
);

router.put(
  "/change-password",
  authJWT,
  changePassword
);

module.exports = router;

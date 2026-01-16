const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verifyOtp,
  refreshToken,
  logout
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

module.exports = router;

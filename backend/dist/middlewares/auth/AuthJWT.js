"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");
const authJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select("-password -otp");
        if (!user.isUserLoggedIn) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "User not valid" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token", err: err.message });
    }
};
module.exports = authJWT;

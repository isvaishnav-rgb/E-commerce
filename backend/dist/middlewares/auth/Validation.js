"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { body, validationResult } = require("express-validator");
const signupValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&]/)
        .withMessage("Password must contain at least one special character"),
    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be exactly 10 digits"),
    // FINAL VALIDATION HANDLER
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                message: "Validation failed",
                errors: errors.array(),
            });
        }
        next();
    },
];
module.exports = {
    signupValidation,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendOtpEmail = async (to, otp) => {
    return transporter.sendMail({
        from: `"ApnaMart" <${process.env.MAIL_USER}>`,
        to,
        subject: "OTP Verification",
        html: `<h1>${otp}</h1>`,
    });
};
const sendEmail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"ApnaMart" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
};
module.exports = { sendOtpEmail, sendEmail };

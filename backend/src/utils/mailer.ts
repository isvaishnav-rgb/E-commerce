const nodemailer = require("nodemailer");
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOtpEmail = async (to: string, otp: string) => {
  return transporter.sendMail({
    from: `"ApnaMart" <${process.env.MAIL_USER}>`,
    to,
    subject: "OTP Verification",
    html: `<h1>${otp}</h1>`,
  });
};

module.exports = { sendOtpEmail };

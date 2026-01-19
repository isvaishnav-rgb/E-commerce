"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceProviderApplication = require("../../models/ServiceProviderApplication.model").default;
const uploadToCloudinary = require("../../utils/uploadToCloudinary");
const User = require("../../models/User.model");
/* =========================
   APPLY / UPDATE (PENDING)
========================= */
const applyOrUpdateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessName, documentTypes, phone } = req.body;
        // 🔹 Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 🔹 If phone missing in user, require it from request
        if (!user.phone) {
            if (!phone) {
                return res.status(400).json({
                    message: "Phone number is required",
                });
            }
            // Optional validation
            if (!/^[6-9]\d{9}$/.test(phone)) {
                return res.status(400).json({
                    message: "Invalid phone number format",
                });
            }
            // Save phone to user
            user.phone = phone;
            await user.save();
        }
        let application = await ServiceProviderApplication.findOne({ user: userId });
        if (application && application.status !== "Pending") {
            return res.status(400).json({
                message: `Cannot update application once it is ${application.status}`,
            });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "KYC documents are required",
            });
        }
        const kycDocs = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const type = documentTypes[i];
            const uploaded = await uploadToCloudinary(file.buffer, "kyc-documents");
            kycDocs.push({
                type,
                documentNumber: "MASKED",
                documentImage: uploaded,
            });
        }
        if (!application) {
            application = await ServiceProviderApplication.create({
                user: userId,
                businessName,
                businessEmail: user.email,
                businessPhone: user.phone,
                kycDocuments: kycDocs,
            });
        }
        else {
            application.businessName = businessName;
            application.businessEmail = user.email;
            application.businessPhone = user.phone;
            application.kycDocuments = kycDocs;
            await application.save();
        }
        res.status(201).json({
            message: "Application submitted successfully",
            application,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Application submission failed",
            err: err.message,
        });
    }
};
const getMyServiceProviderApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const application = await ServiceProviderApplication
            .findOne({ user: userId })
            .populate("user", "name email phone role");
        if (!application) {
            return res.status(200).json({
                message: "No service provider application found",
                application: null,
            });
        }
        res.status(200).json({
            message: "Service provider application fetched",
            application,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch application",
            error: error.message,
        });
    }
};
module.exports = {
    applyOrUpdateApplication,
    getMyServiceProviderApplication,
};

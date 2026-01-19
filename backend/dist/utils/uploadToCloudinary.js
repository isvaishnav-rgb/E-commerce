"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary = require("../config/cloudinary").default;
const uploadBufferToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result.secure_url);
        })
            .end(buffer);
    });
};
module.exports = uploadBufferToCloudinary;

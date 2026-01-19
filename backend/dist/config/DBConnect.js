"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const DBConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB is connected Successfully");
    }
    catch (err) {
        console.log("DB is not connect", err.message);
    }
};
module.exports = DBConnect;

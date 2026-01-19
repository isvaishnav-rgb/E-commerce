"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    finalPrice: {
        type: Number,
    },
    images: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    soldCount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "OutOfStock"],
        default: "Active",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdByRole: {
        type: String,
        enum: ["admin", "provider"],
        required: true,
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
/* =====================
   Middleware
===================== */
ProductSchema.pre("save", function () {
    const product = this;
    product.finalPrice =
        product.price - (product.price * product.discount) / 100;
});
// Auto calculate final price
ProductSchema.pre("findOneAndUpdate", async function () {
    const update = this.getUpdate();
    if (!update)
        return;
    const price = update.price ?? update.$set?.price;
    const discount = update.discount ?? update.$set?.discount;
    if (price === undefined && discount === undefined)
        return;
    const doc = await this.model.findOne(this.getQuery());
    if (!doc)
        return;
    const finalPrice = (price ?? doc.price) -
        ((price ?? doc.price) * (discount ?? doc.discount)) / 100;
    if (!update.$set)
        update.$set = {};
    update.$set.finalPrice = finalPrice;
});
const Product = mongoose_1.default.model("Product", ProductSchema);
module.exports = Product;

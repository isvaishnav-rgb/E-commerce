import mongoose = require("mongoose");
import { Document, Types } from "mongoose";

const { Schema } = mongoose;

/* =======================
   TYPES & INTERFACES
======================= */

export type UserRole = "admin" | "provider" | "user";

export interface IAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

export interface ICartItem {
    product: Types.ObjectId;
    quantity: number;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;

    role: UserRole;

    address?: IAddress;

    cart: ICartItem[];
    wishlist: Types.ObjectId[];
    orders: Types.ObjectId[];

    isProviderVerified: boolean;
    isActive: boolean;
    refreshToken: string;
    verified: boolean;
    otp: string;

    createdAt: Date;
    updatedAt: Date;

    isUserLoggedIn: Boolean;
}

/* =======================
   SUB SCHEMAS
======================= */

const AddressSchema = new Schema<IAddress>(
    {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
    },
    { _id: false }
);

const CartItemSchema = new Schema<ICartItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

/* =======================
   USER SCHEMA
======================= */

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        phone: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "provider", "user"],
            default: "user",
        },

        address: AddressSchema,

        cart: {
            type: [CartItemSchema],
            default: [],
        },

        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        orders: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],

        isProviderVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        refreshToken: {
            type: String,
            default: "",
        },

        verified: {
            type: Boolean,
            default: false,
        },

        otp: {
            type: String,
            default: "",
        },

        isUserLoggedIn: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

/* =======================
   MODEL EXPORT (COMMONJS)
======================= */

const User = mongoose.model<IUser>("User", UserSchema);

module.exports = User;

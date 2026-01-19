const mongoose = require("mongoose");
const { Schema } = mongoose;

const AddressSchema = new Schema(
    {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
    },
    { _id: false }
);

const CartItemSchema = new Schema(
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

const UserSchema = new Schema(
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
            default: false,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;

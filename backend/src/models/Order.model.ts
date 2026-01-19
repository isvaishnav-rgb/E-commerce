import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Shipped"
  | "Delivered"
  | "Returned";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  address: string;
  phone: string;
  status: OrderStatus;
  payment?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Shipped",
        "Delivered",
        "Returned",
      ],
      default: "Pending",
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>(
  "Order",
  OrderSchema
);

module.exports = Order;

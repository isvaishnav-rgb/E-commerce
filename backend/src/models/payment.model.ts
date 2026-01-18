import mongoose, { Schema, Document } from "mongoose";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number;
  method: "Stripe" | "COD";
  status: PaymentStatus;
  checkoutSessionId?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    method: {
      type: String,
      enum: ["Stripe", "COD"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    checkoutSessionId: String,

    transactionId: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);

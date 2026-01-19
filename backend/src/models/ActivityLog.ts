import mongoose, { Schema, Document, Types } from "mongoose";

export interface IActivityLog extends Document {
  actor: Types.ObjectId; // admin or provider
  action: string; // CREATE_PRODUCT, DELETE_PRODUCT
  targetType: "Product" | "User";
  targetId: Types.ObjectId;
  description?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["Product", "User"],
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    description: {
      type: String,
    },

    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);

module.exports = ActivityLog;

import mongoose, { Schema, Document } from "mongoose";

/* =======================
   TYPES
======================= */

export type ApplicationStatus = "Pending" | "Approved" | "Rejected";

export interface IKycDocument {
  type: "Aadhaar" | "PAN";
  documentNumber: string;
  documentImage: string; // URL or cloud storage path
}

export interface IServiceProviderApplication extends Document {
  user: mongoose.Types.ObjectId;

  businessName: string;
  businessEmail: string;
  businessPhone: string;

  kycDocuments: IKycDocument[];

  status: ApplicationStatus;
  adminRemark?: string;

  appliedAt: Date;
  reviewedAt?: Date;
}

/* =======================
   KYC DOCUMENT SCHEMA
======================= */

const KycDocumentSchema = new Schema<IKycDocument>(
  {
    type: {
      type: String,
      enum: ["Aadhaar", "PAN"],
      required: true,
    },
    documentNumber: {
      type: String,
      required: true,
    },
    documentImage: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/* =======================
   APPLICATION SCHEMA
======================= */

const ServiceProviderApplicationSchema =
  new Schema<IServiceProviderApplication>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // one application per user
      },

      businessName: {
        type: String,
        required: true,
      },

      businessEmail: {
        type: String,
        required: true,
      },

      businessPhone: {
        type: String,
        required: true,
      },

      kycDocuments: {
        type: [KycDocumentSchema],
        required: true,
      },

      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },

      adminRemark: {
        type: String,
      },

      appliedAt: {
        type: Date,
        default: Date.now,
      },

      reviewedAt: {
        type: Date,
      },
    },
    {
      timestamps: false,
    }
  );

/* =======================
   MODEL EXPORT
======================= */

const ServiceProviderApplication = mongoose.model<IServiceProviderApplication>(
  "ServiceProviderApplication",
  ServiceProviderApplicationSchema
);

export default ServiceProviderApplication;

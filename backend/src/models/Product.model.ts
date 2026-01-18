import mongoose, { Schema, Document } from "mongoose";

/* =====================
   Product Interface
===================== */

export interface IProduct extends Document {
  name: string;
  description: string;

  price: number;
  discount: number; // percentage
  finalPrice: number;

  images: string[];
  category: string;
  tags: string[];

  stock: number;
  soldCount: number;

  status: "Active" | "Inactive" | "OutOfStock";

  createdBy: mongoose.Types.ObjectId; // service provider
  createdByRole: "admin" | "provider";

  ratings: {
    average: number;
    count: number;
  };

  isFeatured: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =====================
   Product Schema
===================== */

const ProductSchema = new Schema<IProduct>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

/* =====================
   Middleware
===================== */

ProductSchema.pre("save", function () {
  const product = this as IProduct;

  product.finalPrice =
    product.price - (product.price * product.discount) / 100;

});


// Auto calculate final price
ProductSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as any;
  if (!update) return;

  const price = update.price ?? update.$set?.price;
  const discount = update.discount ?? update.$set?.discount;

  if (price === undefined && discount === undefined) return;

  const doc = await this.model.findOne(this.getQuery());
  if (!doc) return;

  const finalPrice =
    (price ?? doc.price) -
    ((price ?? doc.price) * (discount ?? doc.discount)) / 100;

  if (!update.$set) update.$set = {};
  update.$set.finalPrice = finalPrice;
});

export default mongoose.model<IProduct>("Product", ProductSchema);

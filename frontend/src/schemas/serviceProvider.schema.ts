import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const fileSchema = z
  .instanceof(File)
  .refine((file) => ALLOWED_TYPES.includes(file.type), {
    message: "Only PDF, JPG, JPEG, PNG allowed",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be under 2MB",
  });

export const serviceProviderSchema = z
  .object({
    businessName: z
      .string()
      .min(3, "Business name must be at least 3 characters"),

    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]{10}$/.test(val), {
        message: "Phone number must be 10 digits",
      }),

    aadhaar: fileSchema.optional(),
    pan: fileSchema.optional(),
  })
  .refine((data) => data.aadhaar || data.pan, {
    message: "Upload at least one document (Aadhaar or PAN)",
    path: ["aadhaar"],
  });

export type ServiceProviderFormData = z.infer<
  typeof serviceProviderSchema
>;

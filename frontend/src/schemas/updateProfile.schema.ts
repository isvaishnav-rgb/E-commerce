import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number")
    .optional(),

  address: z
    .object({
      street: z
        .string()
        .trim()
        .min(3, "Street must be at least 3 characters")
        .max(100, "Street cannot exceed 100 characters")
        .optional(),

      city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(50, "City cannot exceed 50 characters")
        .optional(),

      state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State cannot exceed 50 characters")
        .optional(),

      country: z
        .string()
        .trim()
        .min(2, "Country must be at least 2 characters")
        .max(50, "Country cannot exceed 50 characters")
        .optional(),

      pincode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Pincode must be a valid 6-digit number")
        .optional(),
    })
    .optional(),
});

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(50).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Phone number must be valid")
    .optional()
    .or(z.literal("")),
  address: z.object({
    street: z.string().trim().min(3).max(100).optional().or(z.literal("")),
    city: z.string().trim().min(2).max(50).optional().or(z.literal("")),
    state: z.string().trim().min(2).max(50).optional().or(z.literal("")),
    country: z.string().trim().min(2).max(50).optional().or(z.literal("")),
    pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits").optional().or(z.literal("")),
  }).default({}),
});

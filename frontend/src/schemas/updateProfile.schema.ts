import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter required")
    .regex(/[a-z]/, "One lowercase letter required")
    .regex(/[0-9]/, "One number required")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

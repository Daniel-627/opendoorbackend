import { z } from "zod";

/**
 * =========================
 * Signup validation
 * =========================
 */
export const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number too short")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),

  fullName: z
    .string()
    .min(2, "Full name is required"),

  provider: z
    .enum(["local", "google"])
    .default("local"),
})
.refine(
  (data) => {
    if (data.provider === "google") return true;
    return (data.email || data.phone) && data.password;
  },
  {
    message: "Email/phone and password are required for local signup",
    path: ["email"],
  }
);

/**
 * =========================
 * Login validation
 * =========================
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required"),

  password: z
    .string()
    .min(1, "Password is required"),

  provider: z
    .enum(["local", "google"])
    .default("local"),
})
.refine(
  (data) => {
    if (data.provider === "google") return true;
    return !!data.password;
  },
  {
    message: "Password is required for local login",
    path: ["password"],
  }
);

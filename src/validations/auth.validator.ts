import { z } from "zod";

/**
 * =========================
 * Signup validation
 * =========================
 */
export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  phone: z
    .string()
    .min(10, "Phone number too short")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  fullName: z
    .string()
    .min(2, "Full name is required"),

  provider: z
    .enum(["local", "google"])
    .default("local"),
});

/**
 * =========================
 * Login validation
 * =========================
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required"),

  provider: z
    .enum(["local", "google"])
    .default("local"),
});

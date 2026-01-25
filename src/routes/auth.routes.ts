import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema } from "../validations/auth.validator";

export const authRoutes = Router();

// Signup
authRoutes.post("/signup", validate(signupSchema), AuthController.signup);

// Login
authRoutes.post("/login", validate(loginSchema), AuthController.login);

// Current user (protected route)
authRoutes.get("/me", requireAuth, AuthController.me);

// Logout (protected)
authRoutes.post("/logout", requireAuth, AuthController.logout);

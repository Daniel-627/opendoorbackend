import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";

export const authRoutes = Router();

// Signup
authRoutes.post("/signup", AuthController.signup);

// Login
authRoutes.post("/login", AuthController.login);

// Current user (protected route)
authRoutes.get("/me", requireAuth, AuthController.me);

// Logout (protected)
authRoutes.post("/logout", requireAuth, AuthController.logout);

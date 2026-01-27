import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  /**
   * =========================
   * Signup
   * =========================
   */
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.signup(req.body);

      // 🔐 Set HttpOnly JWT cookie
      res.cookie("access_token", user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * =========================
   * Login
   * =========================
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await AuthService.login(req.body);

      // 🔐 Set HttpOnly JWT cookie
      res.cookie("access_token", session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      res.json({
        userId: session.userId,
        roles: session.roles,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * =========================
   * Current user
   * =========================
   */
  static async me(req: Request, res: Response) {
    // requireAuth will populate req.user
    res.json({ user: req.user });
  }

  /**
   * =========================
   * Logout
   * =========================
   */
  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      // 🧹 JWT logout = clear cookie only
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

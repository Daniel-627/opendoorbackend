import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * JWT payload shape
 * This MUST match what you sign during login / register
 */
interface JwtPayload {
  userId: string;
  roles: string[]; // ADMIN | OWNER | MANAGER | TENANT
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 🔑 1. Read JWT from cookie
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No access token",
      });
    }

    // 🔐 2. Verify & decode JWT
    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired token",
      });
    }

    // ✅ 3. Attach user info from token (NO DB CALLS)
    req.user = {
      id: payload.userId,
      roles: payload.roles,
    };

    // 🚀 4. Continue
    return next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


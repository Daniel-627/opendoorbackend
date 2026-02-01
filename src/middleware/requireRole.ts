// src/middlewares/requireRole.ts
import { Request, Response, NextFunction } from "express";

/**
 * Require at least ONE of the given roles
 */
export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // requireAuth MUST run before this
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRoles = req.user.roles ?? [];

    const hasRole = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
}

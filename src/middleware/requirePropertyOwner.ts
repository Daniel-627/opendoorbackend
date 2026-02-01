// src/middlewares/requirePropertyOwner.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { property_owners } from "../db/schema";
import { and, eq } from "drizzle-orm";

export function requirePropertyOwner() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const rawPropertyId = req.params.propertyId;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!rawPropertyId || Array.isArray(rawPropertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const propertyId = rawPropertyId;

      // 🛡️ Admin override
      if (user.roles.includes("admin")) {
        return next();
      }

      // 🏠 Approved owner only
      const owner = await db
        .select({ id: property_owners.id })
        .from(property_owners)
        .where(
          and(
            eq(property_owners.property_id, propertyId),
            eq(property_owners.user_id, user.id),
            eq(property_owners.status, "approved")
          )
        )
        .limit(1);

      if (owner.length === 0) {
        return res.status(403).json({
          message: "Forbidden: owner access required",
        });
      }

      next();
    } catch (err) {
      console.error("requirePropertyOwner error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

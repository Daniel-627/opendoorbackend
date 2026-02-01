// src/middlewares/requirePropertyAccess.ts
import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { property_owners, property_managers } from "../db/schema";
import { and, eq } from "drizzle-orm";

export function requirePropertyAccess() {
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

      // 🛡️ Admin bypass
      if (user.roles.includes("admin")) {
        return next();
      }

      // 🏠 Check ownership
      const owner = await db
        .select()
        .from(property_owners)
        .where(
          and(
            eq(property_owners.property_id, propertyId),
            eq(property_owners.user_id, user.id),
            eq(property_owners.status, "approved")
          )
        )
        .limit(1);

      if (owner.length > 0) {
        return next();
      }

      // 🧑‍🔧 Check manager access
      const manager = await db
        .select()
        .from(property_managers)
        .where(
          and(
            eq(property_managers.property_id, propertyId),
            eq(property_managers.user_id, user.id),
            eq(property_managers.status, "approved")
          )
        )
        .limit(1);

      if (manager.length > 0) {
        return next();
      }

      return res.status(403).json({
        message: "Forbidden: no access to this property",
      });
    } catch (err) {
      console.error("requirePropertyAccess error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

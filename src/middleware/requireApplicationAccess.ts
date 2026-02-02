import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import {
  lease_applications,
  units,
  properties,
  property_owners,
  property_managers,
} from "../db/schema";
import { eq, and, or } from "drizzle-orm";

export function requireApplicationAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { applicationId } = req.params;
      const user = req.user;

      if (!applicationId || Array.isArray(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 🔑 Admin shortcut
      if (user.roles.includes("admin")) {
        return next();
      }

      /**
       * We verify the chain:
       * application → unit → property → owner/manager
       */
      const rows = await db
        .select({
          applicationId: lease_applications.id,
        })
        .from(lease_applications)
        .innerJoin(units, eq(units.id, lease_applications.unit_id))
        .innerJoin(properties, eq(properties.id, units.property_id))
        .leftJoin(
          property_owners,
          and(
            eq(property_owners.property_id, properties.id),
            eq(property_owners.user_id, user.id),
            eq(property_owners.status, "approved")
          )
        )
        .leftJoin(
          property_managers,
          and(
            eq(property_managers.property_id, properties.id),
            eq(property_managers.user_id, user.id),
            eq(property_managers.status, "approved")
          )
        )
        .where(
          and(
            eq(lease_applications.id, applicationId),
            or(
              eq(property_owners.user_id, user.id),
              eq(property_managers.user_id, user.id)
            )
          )
        );

      if (!rows.length) {
        return res.status(403).json({
          message: "You do not have access to this application",
        });
      }

      next();
    } catch (err) {
      console.error("requireApplicationAccess error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

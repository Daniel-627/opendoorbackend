import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import {
  leases,
  lease_tenants,
  property_owners,
  property_managers,
  units,
} from "../db/schema";
import { eq, and } from "drizzle-orm";

export function requireLeaseAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const leaseId = req.params.leaseId as string;

      if (!userId || !leaseId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 1️⃣ Load lease
      const lease = await db
        .select()
        .from(leases)
        .where(eq(leases.id, leaseId))
        .then(r => r[0]);

      if (!lease) {
        return res.status(404).json({ message: "Lease not found" });
      }

      // 2️⃣ Tenant access
      const tenant = await db
        .select()
        .from(lease_tenants)
        .where(
          and(
            eq(lease_tenants.lease_id, leaseId),
            eq(lease_tenants.user_id, userId)
          )
        )
        .then(r => r[0]);

      if (tenant) {
        req.lease = lease;
        req.leaseRole = "tenant";
        return next();
      }

      // 3️⃣ Owner / Manager access (via unit → property)
      const unit = await db
        .select()
        .from(units)
        .where(eq(units.id, lease.unit_id))
        .then(r => r[0]);

      if (!unit) {
        return res.status(403).json({ message: "Access denied" });
      }

      const owner = await db
        .select()
        .from(property_owners)
        .where(
          and(
            eq(property_owners.property_id, unit.property_id),
            eq(property_owners.user_id, userId),
            eq(property_owners.status, "approved")
          )
        )
        .then(r => r[0]);

      if (owner) {
        req.lease = lease;
        req.leaseRole = "owner";
        return next();
      }

      const manager = await db
        .select()
        .from(property_managers)
        .where(
          and(
            eq(property_managers.property_id, unit.property_id),
            eq(property_managers.user_id, userId),
            eq(property_managers.status, "approved")
          )
        )
        .then(r => r[0]);

      if (manager) {
        req.lease = lease;
        req.leaseRole = "manager";
        return next();
      }

      return res.status(403).json({ message: "No lease access" });
    } catch (err) {
      next(err);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { units } from "../db/schema/units";
import { property_owners } from "../db/schema/property_owners";
import { property_managers } from "../db/schema/property_managers";
import { eq, and } from "drizzle-orm";

// Extend Express Request interface to include unit and propertyId
declare global {
  namespace Express {
    interface Request {
      unit?: { id: string; property_id: string };
      propertyId?: string;
    }
  }
}

export async function requireUnitAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { unitId } = req.params;
  const userId = req.user?.id;

  if (!unitId || !userId || typeof unitId !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 1️⃣ Get unit + property
  const unit = await db.query.units.findFirst({
    where: eq(units.id, unitId),
    columns: { id: true, property_id: true },
  });

  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  const propertyId = unit.property_id;

  // 2️⃣ Check owner access
  const ownerAccess = await db.query.property_owners.findFirst({
    where: and(
      eq(property_owners.property_id, propertyId),
      eq(property_owners.user_id, userId),
      eq(property_owners.status, "approved")
    ),
  });

  // 3️⃣ Check manager access
  const managerAccess = await db.query.property_managers.findFirst({
    where: and(
      eq(property_managers.property_id, propertyId),
      eq(property_managers.user_id, userId),
      eq(property_managers.status, "approved")
    ),
  });

  if (!ownerAccess && !managerAccess) {
    return res.status(403).json({ message: "No access to this unit" });
  }

  // 4️⃣ Attach context for downstream use
  req.unit = unit;
  req.propertyId = propertyId;

  next();
  return;
}

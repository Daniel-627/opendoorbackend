import { db } from "../../db/db";
import { lease_applications, units, leases } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class ApplicationsService {
  static async apply(unitId: string, applicantId: string) {
    // 1️⃣ Ensure unit exists
    const unit = await db
      .select()
      .from(units)
      .where(eq(units.id, unitId))
      .then(rows => rows[0]);

    if (!unit) {
      throw new Error("Unit not found");
    }

    // 2️⃣ Ensure unit is not already leased
    const activeLease = await db
      .select()
      .from(leases)
      .where(
        and(
          eq(leases.unit_id, unitId),
          eq(leases.status, "active")
        )
      )
      .then(rows => rows[0]);

    if (activeLease) {
      throw new Error("Unit already leased");
    }

    // 3️⃣ Prevent duplicate applications by same user
    const existing = await db
      .select()
      .from(lease_applications)
      .where(
        and(
          eq(lease_applications.unit_id, unitId),
          eq(lease_applications.applicant_id, applicantId),
          eq(lease_applications.status, "pending")
        )
      )
      .then(rows => rows[0]);

    if (existing) {
      throw new Error("You already applied for this unit");
    }

    // 4️⃣ Create application
    const rows = await db
      .insert(lease_applications)
      .values({
        unit_id: unitId,
        applicant_id: applicantId,
      })
      .returning();

    const application = rows[0];
    if (!application) {
      throw new Error("Failed to create application");
    }

    return application;
  }
}

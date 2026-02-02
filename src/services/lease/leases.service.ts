import { db } from "../../db/db";
import { leases, units } from "../../db/schema";
import { eq } from "drizzle-orm";

export class LeasesService {
  static async update(
    leaseId: string,
    data: Partial<{
      end_date: string;
      rent_cycle: "monthly" | "quarterly" | "yearly";
    }>
  ) {
    const rows = await db
      .update(leases)
      .set(data)
      .where(eq(leases.id, leaseId))
      .returning();

    const lease = rows[0];
    if (!lease) throw new Error("Lease not found");

    return lease;
  }

  /**
   * Lease termination (MVP)
   */
  static async terminate(leaseId: string) {
    const rows = await db
      .update(leases)
      .set({
        status: "ended",
        end_date: new Date().toISOString().split("T")[0],
      })
      .where(eq(leases.id, leaseId))
      .returning();

    const lease = rows[0];
    if (!lease) throw new Error("Lease not found");

    // Free the unit
    await db
      .update(units)
      .set({ status: "vacant" })
      .where(eq(units.id, lease.unit_id));

    return lease;
  }
}

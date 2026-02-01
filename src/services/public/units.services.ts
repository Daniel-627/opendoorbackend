import { db } from "../../db/db";
import { units, unit_details } from "../../db/schema";
import { eq } from "drizzle-orm";

export class PublicUnitsService {
  static async getOne(unitId: string) {
    const rows = await db
      .select({
        id: units.id,
        label: units.label,
        unit_type: units.unit_type,
        rent_amount: units.rent_amount,
        status: units.status,
      })
      .from(units)
      .where(eq(units.id, unitId))
      .limit(1);

    if (!rows.length) {
      throw new Error("Unit not found");
    }

    return rows[0];
  }

  static async details(unitId: string) {
    return db
      .select({
        key: unit_details.key,
        value: unit_details.value,
      })
      .from(unit_details)
      .where(eq(unit_details.unitId, unitId));
  }
}

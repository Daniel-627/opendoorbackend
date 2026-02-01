import { db } from "../../db/db";
import { units } from "../../db/schema";
import { eq } from "drizzle-orm";

export class UnitsService {
  static async create(
    propertyId: string,
    data: {
      label: string;
      unit_type?: string;
      rent_amount: string;
    }
  ) {
    const rows = await db
      .insert(units)
      .values({
        property_id: propertyId,
        label: data.label,
        unit_type: data.unit_type,
        rent_amount: data.rent_amount,
      })
      .returning();

    const unit = rows[0];
    if (!unit) {
      throw new Error("Failed to create unit");
    }

    return unit;
  }

  static async list(propertyId: string) {
    return db
      .select()
      .from(units)
      .where(eq(units.property_id, propertyId));
  }

  static async update(
    unitId: string,
    data: {
      label?: string;
      unit_type?: string;
      rent_amount?: string;
      status?: "vacant" | "occupied";
    }
  ) {
    const rows = await db
      .update(units)
      .set(data)
      .where(eq(units.id, unitId))
      .returning();

    const unit = rows[0];
    if (!unit) {
      throw new Error("Unit not found");
    }

    return unit;
  }

  static async remove(unitId: string) {
    await db.delete(units).where(eq(units.id, unitId));
  }
}

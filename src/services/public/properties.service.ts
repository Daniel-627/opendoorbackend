import { db } from "../../db/db";
import { properties, units, unit_details } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class PublicPropertiesService {
  static async list() {
    return db
      .select({
        id: properties.id,
        name: properties.name,
        location: properties.location,
      })
      .from(properties);
  }

  static async getOne(propertyId: string) {
    const rows = await db
      .select({
        id: properties.id,
        name: properties.name,
        location: properties.location,
      })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!rows.length) {
      throw new Error("Property not found");
    }

    return rows[0];
  }

  static async units(propertyId: string) {
    return db
      .select({
        id: units.id,
        label: units.label,
        unit_type: units.unit_type,
        rent_amount: units.rent_amount,
        status: units.status,
      })
      .from(units)
      .where(
        and(
          eq(units.property_id, propertyId),
          eq(units.status, "vacant")
        )
      );
  }
}

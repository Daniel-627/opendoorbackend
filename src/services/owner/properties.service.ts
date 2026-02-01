import { db } from "../../db/db";
import { properties, property_owners } from "../../db/schema";
import { eq } from "drizzle-orm";

export class OwnerPropertiesService {
  static async create(user: any, data: { name: string; location?: string }) {
    // 1️⃣ Create property
    const result = await db
      .insert(properties)
      .values({
        name: data.name,
        location: data.location,
      })
      .returning({ id: properties.id });

      if (!result.length) {
        throw new Error("Failed to create property");
      }
      
      const propertyId = result[0]!.id;
      
    // 2️⃣ Assign creator as APPROVED owner
    await db.insert(property_owners).values({
      property_id: propertyId,
      user_id: user.id,
      role: "primary_owner",
      status: "approved",
    });

    return {
      id: propertyId,
      name: data.name,
      location: data.location,
    };
  }

  static async mine(user: any) {
    if (user.roles.includes("admin")) {
      return db.select().from(properties);
    }

    return db
      .select({
        id: properties.id,
        name: properties.name,
        location: properties.location,
      })
      .from(property_owners)
      .innerJoin(
        properties,
        eq(property_owners.property_id, properties.id)
      )
      .where(
        eq(property_owners.user_id, user.id)
      );
  }

  static async update(
    propertyId: string,
    data: { name?: string; location?: string }
  ) {
    const rows = await db
      .update(properties)
      .set(data)
      .where(eq(properties.id, propertyId))
      .returning();

    if (!rows.length) {
      throw new Error("Property not found");
    }

    return rows[0];
  }

  static async remove(propertyId: string) {
    await db.delete(properties).where(eq(properties.id, propertyId));
  }
}

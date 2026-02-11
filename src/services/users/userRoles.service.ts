import { db } from "../../db/db";
import { user_roles } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class UserRolesService {
  static async assignRole(userId: string, role: string) {
    const existing = await db
      .select()
      .from(user_roles)
      .where(
        and(
          eq(user_roles.user_id, userId),
          eq(user_roles.role, role)
        )
      )
      .then(r => r[0]);

    if (existing) {
      throw new Error("User already has this role");
    }

    const rows = await db
      .insert(user_roles)
      .values({
        user_id: userId,
        role,
        status: "active",
      })
      .returning();

    return rows[0];
  }

  static async revokeRole(userId: string, role: string) {
    const result = await db
      .update(user_roles)
      .set({ status: "revoked" })
      .where(
        and(
          eq(user_roles.user_id, userId),
          eq(user_roles.role, role)
        )
      )
      .returning();

    if (!result.length) {
      throw new Error("Role not found for user");
    }

    return result[0];
  }

  static async getUserRoles(userId: string) {
    return db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, userId));
  }
}

import { pgTable, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { leases } from "./leases";
import { users } from "./users";

export const leaseTenantRoleEnum = pgEnum("lease_tenant_role", [
  "primary",
  "secondary",
]);

export const lease_tenants = pgTable("lease_tenants", {
  id: uuid("id").defaultRandom().primaryKey(),

  lease_id: uuid("lease_id")
    .notNull()
    .references(() => leases.id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  role: leaseTenantRoleEnum("role").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

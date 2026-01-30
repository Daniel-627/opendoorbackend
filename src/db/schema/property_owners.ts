import { pgTable, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { users } from "./users";

export const ownerRoleEnum = pgEnum("owner_role", [
  "primary_owner",
  "co_owner",
]);

export const ownerStatusEnum = pgEnum("owner_status", [
  "pending",
  "approved",
]);

export const property_owners = pgTable("property_owners", {
  id: uuid("id").defaultRandom().primaryKey(),

  property_id: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  role: ownerRoleEnum("role").notNull(),
  status: ownerStatusEnum("status").default("pending").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { users } from "./users";
import { ownerRoleEnum, ownerStatusEnum } from "./enums";


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

import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { users } from "./users";
import { managerStatusEnum } from "./enums";



export const property_managers = pgTable("property_managers", {
  id: uuid("id").defaultRandom().primaryKey(),

  property_id: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  invited_by: uuid("invited_by")
    .references(() => users.id, { onDelete: "set null" }),

  status: managerStatusEnum("status").default("pending").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

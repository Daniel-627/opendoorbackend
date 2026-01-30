import { pgTable, uuid, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { unitStatusEnum } from "./enums";


export const units = pgTable("units", {
  id: uuid("id").defaultRandom().primaryKey(),

  property_id: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),

  label: text("label").notNull(), // A1, B2, Shop 3
  unit_type: text("unit_type"), // apartment, studio, shop

  rent_amount: numeric("rent_amount", { precision: 12, scale: 2 })
    .notNull(),

  status: unitStatusEnum("status").default("vacant").notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { units } from "./units";

export const unit_details = pgTable("unit_details", {
  id: uuid("id").defaultRandom().primaryKey(),

  unitId: uuid("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),

  key: text("key").notNull(),   // bedrooms, bathrooms, parking, floor_area
  value: text("value").notNull(), // "3", "2", "yes", "45sqm"

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

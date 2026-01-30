import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  location: text("location"),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

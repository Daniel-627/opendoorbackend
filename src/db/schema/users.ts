import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).unique(),
  phone_number: varchar("phone_number", { length: 20 }).unique(),

  full_name: varchar("full_name", { length: 255 }),
  avatar_url: text("avatar_url"),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  last_login_at: timestamp("last_login_at", { withTimezone: true }),
});

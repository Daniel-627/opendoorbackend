import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const user_roles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull(),
  role: varchar("role", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

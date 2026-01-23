import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const auth_sessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id").notNull(),

  session_token: varchar("session_token", {
    length: 255,
  }).notNull().unique(),

  expires_at: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

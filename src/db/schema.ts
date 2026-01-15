import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: text("password_hash"),
  role: varchar("role", { length: 32 }).notNull().default("user"),
  created_at: timestamp("created_at").defaultNow(),
});

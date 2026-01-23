import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const auth_credentials = pgTable(
  "auth_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    identifier: varchar("identifier", { length: 255 }).notNull(),
    // email OR phone

    identifier_type: varchar("identifier_type", { length: 16 }).notNull(),
    // "email" | "phone"

    password_hash: varchar("password_hash", { length: 255 }).notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    identifier_unique: unique().on(
      table.identifier,
      table.identifier_type
    ),
  })
);

import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const auth_providers = pgTable(
  "auth_providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    provider: varchar("provider", { length: 32 }).notNull(),
    // "google"

    provider_user_id: varchar("provider_user_id", {
      length: 255,
    }).notNull(),

    email: varchar("email", { length: 255 }),

    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    provider_unique: unique().on(
      table.provider,
      table.provider_user_id
    ),
  })
);

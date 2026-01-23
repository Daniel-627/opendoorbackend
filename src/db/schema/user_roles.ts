import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const user_roles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    role: varchar("role", { length: 32 }).notNull(),
    // tenant | landlord | manager | admin

    status: varchar("status", { length: 32 })
      .notNull()
      .default("active"),
    // active | pending | rejected | revoked

    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    user_role_unique: unique().on(table.user_id, table.role),
  })
);

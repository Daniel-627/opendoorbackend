import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  text,
} from "drizzle-orm/pg-core";

import { leases } from "./leases";
import { users } from "./users";

export const adjustmentRequests = pgTable("adjustment_requests", {
  id: uuid("id").defaultRandom().primaryKey(),

  leaseId: uuid("lease_id")
    .references(() => leases.id)
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  period: varchar("period", { length: 20 }).notNull(),

  reason: text("reason").notNull(),

  status: varchar("status", { length: 20 })
    .default("pending")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

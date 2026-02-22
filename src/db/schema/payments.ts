import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

import {
  paymentMethodEnum,
  paymentStatusEnum,
} from "./enums";

import { leases } from "./leases";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  leaseId: uuid("lease_id")
    .references(() => leases.id)
    .notNull(),

  method: paymentMethodEnum("method").notNull(),

  // 🔥 NEW — distinguishes payment purpose
  category: varchar("category", { length: 50 }).notNull(),

  reference: varchar("reference", { length: 255 }).notNull(),

  rawPayload: jsonb("raw_payload").notNull(),

  status: paymentStatusEnum("status")
    .default("pending")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
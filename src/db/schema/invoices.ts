import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { leases } from "./leases";
import { invoiceStatusEnum } from "./enums";

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),

  leaseId: uuid("lease_id")
    .references(() => leases.id)
    .notNull(),

  period: varchar("period", { length: 20 }).notNull(),

  totalAmount: numeric("total_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),

  status: invoiceStatusEnum("status")
    .default("draft")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

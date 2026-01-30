import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { ledgerTypeEnum } from "./enums";
import { users } from "./users";
import { properties } from "./properties";
import { units } from "./units";
import { leases } from "./leases";
import { accounts } from "./accounts";
import { payments } from "./payments";

export const ledgerEntries = pgTable("ledger_entries", {
  id: uuid("id").defaultRandom().primaryKey(),

  propertyId: uuid("property_id").references(() => properties.id),

  unitId: uuid("unit_id").references(() => units.id),

  leaseId: uuid("lease_id").references(() => leases.id),

  userId: uuid("user_id").references(() => users.id),

  type: ledgerTypeEnum("type").notNull(),

  category: varchar("category", { length: 100 }).notNull(),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  accountId: uuid("account_id").references(() => accounts.id),

  currency: varchar("currency", { length: 10 }).default("KES"),

  period: varchar("period", { length: 20 }),

  reference: uuid("reference").references(() => payments.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

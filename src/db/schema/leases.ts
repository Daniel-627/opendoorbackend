import {
  pgTable,
  uuid,
  date,
  pgEnum,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { units } from "./units";

export const rentCycleEnum = pgEnum("rent_cycle", [
  "monthly",
  "quarterly",
  "yearly",
]);

export const leaseStatusEnum = pgEnum("lease_status", [
  "pending",
  "active",
  "ended",
  "cancelled",
]);

export const tenancyTypeEnum = pgEnum("tenancy_type", [
  "single",
  "shared",
]);

export const leases = pgTable("leases", {
  id: uuid("id").defaultRandom().primaryKey(),

  unit_id: uuid("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "restrict" }),

  start_date: date("start_date").notNull(),
  end_date: date("end_date"),

  rent_cycle: rentCycleEnum("rent_cycle").notNull(),

  deposit_amount: numeric("deposit_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),

  status: leaseStatusEnum("status").default("pending").notNull(),

  tenancy_type: tenancyTypeEnum("tenancy_type"),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

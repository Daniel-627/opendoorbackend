import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { units } from "./units";
import { users } from "./users";
import { leaseApplicationStatusEnum } from "./enums";


export const lease_applications = pgTable("lease_applications", {
  id: uuid("id").defaultRandom().primaryKey(),

  unit_id: uuid("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "cascade" }),

  applicant_id: uuid("applicant_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  status: leaseApplicationStatusEnum("status")
    .default("pending")
    .notNull(),

  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
});

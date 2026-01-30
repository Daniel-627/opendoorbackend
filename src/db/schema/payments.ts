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

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  method: paymentMethodEnum("method").notNull(),

  reference: varchar("reference", { length: 255 }).notNull(),

  rawPayload: jsonb("raw_payload").notNull(),

  status: paymentStatusEnum("status")
    .default("pending")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

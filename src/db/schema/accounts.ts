import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { accountTypeEnum } from "./enums";

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  type: accountTypeEnum("type").notNull(),

  parentAccountId: uuid("parent_account_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

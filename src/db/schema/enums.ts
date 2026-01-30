import { pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "income",
  "expense",
  "asset",
  "liability",
]);

export const ledgerTypeEnum = pgEnum("ledger_type", [
  "charge",
  "payment",
  "adjustment",
  "expense",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "mpesa",
  "bank",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "confirmed",
  "failed",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "issued",
  "paid",
  "overdue",
]);

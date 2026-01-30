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

export const leaseApplicationStatusEnum = pgEnum(
  "lease_application_status",
  ["pending", "approved", "rejected"]
);

export const leaseTenantRoleEnum = pgEnum("lease_tenant_role", [
  "primary",
  "secondary",
]);

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

export const managerStatusEnum = pgEnum("manager_status", [
  "pending",
  "approved",
]);

export const ownerRoleEnum = pgEnum("owner_role", [
  "primary_owner",
  "co_owner",
]);

export const ownerStatusEnum = pgEnum("owner_status", [
  "pending",
  "approved",
]);

export const unitStatusEnum = pgEnum("unit_status", [
  "vacant",
  "occupied",
]);
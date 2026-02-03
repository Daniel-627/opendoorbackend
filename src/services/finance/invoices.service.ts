import { db } from "../../db/db";
import {
  invoices,
  leases,
  units,
  ledgerEntries,
} from "../../db/schema";
import { eq } from "drizzle-orm";

export class InvoicesService {
  static async createInvoice(
    leaseId: string,
    data: {
      period: string;
      totalAmount: string;
    }
  ) {
    const lease = await db
      .select()
      .from(leases)
      .where(eq(leases.id, leaseId))
      .then(r => r[0]);

    if (!lease) throw new Error("Lease not found");
    if (lease.status !== "active") {
      throw new Error("Cannot invoice inactive lease");
    }

    const rows = await db
      .insert(invoices)
      .values({
        leaseId,
        period: data.period,
        totalAmount: data.totalAmount,
        status: "draft",
      })
      .returning();

    return rows[0];
  }

  static async listByLease(leaseId: string) {
    return db
      .select()
      .from(invoices)
      .where(eq(invoices.leaseId, leaseId));
  }

  /**
   * ISSUE INVOICE → CREATE LEDGER DEBIT
   */
  static async issueInvoice(invoiceId: string) {
  // 1️⃣ Load invoice
  const invoice = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .then(r => r[0]);

  if (!invoice) throw new Error("Invoice not found");
  if (invoice.status !== "draft")
    throw new Error("Invoice already issued");

  // 1️⃣b Load lease (for context)
  const lease = await db
    .select()
    .from(leases)
    .where(eq(leases.id, invoice.leaseId))
    .then(r => r[0]);

  if (!lease) throw new Error("Lease not found");

  // 1️⃣c Load unit (optional but useful)
  const unit = await db
    .select()
    .from(units)
    .where(eq(units.id, lease.unit_id))
    .then(r => r[0]);

  // 2️⃣ Mark invoice issued
  await db
    .update(invoices)
    .set({ status: "issued" })
    .where(eq(invoices.id, invoiceId));

  // 3️⃣ Create ledger DEBIT (rent owed)
  await db.insert(ledgerEntries).values({
    leaseId: invoice.leaseId,
    unitId: lease.unit_id,
    propertyId: unit?.property_id,
    type: "charge",                 // valid enum value
    category: "rent_invoice",      // semantic meaning
    amount: invoice.totalAmount,
    period: invoice.period,
    reference: invoice.id,         // invoice ↔ ledger link
    currency: "KES",
  });

  return { success: true };
}

}

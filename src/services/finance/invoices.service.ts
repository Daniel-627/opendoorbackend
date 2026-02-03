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
  static async issue(invoiceId: string) {
    // 1️⃣ Load invoice
    const invoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .then(r => r[0]);

    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status !== "draft") {
      throw new Error("Only draft invoices can be issued");
    }

    // 2️⃣ Load lease
    const lease = await db
      .select()
      .from(leases)
      .where(eq(leases.id, invoice.leaseId))
      .then(r => r[0]);

    if (!lease) throw new Error("Lease not found");

    // 3️⃣ Load unit (for ledger context)
    const unit = await db
      .select()
      .from(units)
      .where(eq(units.id, lease.unit_id))
      .then(r => r[0]);

    // 4️⃣ Mark invoice as issued
    const updatedRows = await db
      .update(invoices)
      .set({ status: "issued" })
      .where(eq(invoices.id, invoiceId))
      .returning();

    const issuedInvoice = updatedRows[0];

    // 5️⃣ Create ledger DEBIT (rent charge)
    await db.insert(ledgerEntries).values({
      type: "charge",
      category: "rent",
      amount: invoice.totalAmount,
      leaseId: lease.id,
      unitId: lease.unit_id,
      propertyId: unit?.property_id,
      period: invoice.period,
      reference: invoice.id, // link to invoice
      currency: "KES",
    });

    return issuedInvoice;
  }
}

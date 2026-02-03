import { db } from "../../db/db";
import { invoices, leases } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class InvoicesService {
  /**
   * Create invoice for a lease & period
   */
  static async createInvoice(
    leaseId: string,
    data: {
      period: string;        // e.g. "2026-02"
      totalAmount: string;   // rent amount
    }
  ) {
    // 1️⃣ Ensure lease exists
    const lease = await db
      .select()
      .from(leases)
      .where(eq(leases.id, leaseId))
      .then(r => r[0]);

    if (!lease) {
      throw new Error("Lease not found");
    }

    if (lease.status !== "active") {
      throw new Error("Cannot invoice inactive lease");
    }

    // 2️⃣ Prevent duplicate invoice for same period
    const existing = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.leaseId, leaseId),
          eq(invoices.period, data.period)
        )
      )
      .then(r => r[0]);

    if (existing) {
      throw new Error("Invoice already exists for this period");
    }

    // 3️⃣ Create invoice
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

  /**
   * List invoices for a lease
   */
  static async listByLease(leaseId: string) {
    return db
      .select()
      .from(invoices)
      .where(eq(invoices.leaseId, leaseId))
      .orderBy(invoices.createdAt);
  }

  /**
   * Issue invoice (draft → issued)
   */
  static async issue(invoiceId: string) {
    const rows = await db
      .update(invoices)
      .set({ status: "issued" })
      .where(eq(invoices.id, invoiceId))
      .returning();

    const invoice = rows[0];
    if (!invoice) throw new Error("Invoice not found");

    return invoice;
  }
}

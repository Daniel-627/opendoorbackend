import { db } from "../../db/db";
import { payments, ledgerEntries, leases } from "../../db/schema";
import { eq } from "drizzle-orm";

export class CashPaymentsService {
  /**
   * Tenant declares a cash payment
   */
  static async declareCashPayment(data: {
    leaseId: string;
    amount: string;
    userId: string;
    period?: string;
  }) {
    const paymentRows = await db
      .insert(payments)
      .values({
        method: "cash",
        reference: `cash-${Date.now()}`,
        rawPayload: {
          declaredBy: data.userId,
          amount: data.amount,
          leaseId: data.leaseId,
        },
        status: "pending",
      })
      .returning();

    const payment = paymentRows[0];
    if (!payment) throw new Error("Failed to record cash payment");

    return payment;
  }

  /**
   * Owner / Manager confirms cash payment
   */
  static async confirmCashPayment(paymentId: string) {
    const paymentRows = await db
      .update(payments)
      .set({ status: "confirmed" })
      .where(eq(payments.id, paymentId))
      .returning();

    const payment = paymentRows[0];
    if (!payment) throw new Error("Payment not found");

    const { leaseId, amount } = payment.rawPayload as {
      leaseId: string;
      amount: string;
    };

    // Create ledger CREDIT
    await db.insert(ledgerEntries).values({
      leaseId,
      type: "payment",
      category: "rent_payment",
      amount,
      reference: payment.id,
    });

    return payment;
  }

  /**
   * Reject cash payment
   */
  static async rejectCashPayment(paymentId: string) {
    const rows = await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, paymentId))
      .returning();

    return rows[0];
  }
}

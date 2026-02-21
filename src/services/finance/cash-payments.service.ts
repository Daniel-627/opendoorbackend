import { db } from "../../db/db";
import { payments, leases } from "../../db/schema";
import { eq } from "drizzle-orm";

export class LeaseActivationCashService {
  /**
   * Tenant declares a cash activation payment
   */
  static async declareActivationPayment(data: {
    leaseId: string;
    amount: string;
    userId: string;
  }) {
    const paymentRows = await db
      .insert(payments)
      .values({
        method: "cash",
        reference: `activation-cash-${Date.now()}`,
        rawPayload: {
          leaseId: data.leaseId,
          declaredBy: data.userId,
          type: "lease_activation",
          amount: data.amount,
        },
        status: "pending",
      })
      .returning();

    const payment = paymentRows[0];
    if (!payment) throw new Error("Failed to record activation payment");

    return payment;
  }

  /**
   * Owner confirms activation payment
   * → This ACTIVATES the lease
   */
  static async confirmActivationPayment(paymentId: string) {
    const paymentRows = await db
      .update(payments)
      .set({ status: "confirmed" })
      .where(eq(payments.id, paymentId))
      .returning();

    const payment = paymentRows[0];
    if (!payment) throw new Error("Payment not found");

    if (payment.status !== "confirmed") {
      throw new Error("Payment confirmation failed");
    }

    // Activate lease - leaseId should be available from the payment object
    const leaseId = (payment.rawPayload as any)?.leaseId;
    if (leaseId) {
      await db
        .update(leases)
        .set({
          status: "active",
        })
        .where(eq(leases.id, leaseId));
    }

    return payment;
  }

  /**
   * Owner rejects activation payment
   */
  static async rejectActivationPayment(paymentId: string) {
    const rows = await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, paymentId))
      .returning();

    return rows[0];
  }
}
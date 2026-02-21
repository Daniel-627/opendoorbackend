import { db } from "../../db/db";
import { payments, leases, units } from "../../db/schema";
import { eq } from "drizzle-orm";

export class LeaseActivationCashService {
  /**
   * Tenant declares activation cash payment
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
   * Confirm activation payment
   * → processing_activation → active
   * → unit becomes occupied
   */
  static async confirmActivationPayment(paymentId: string) {
    const paymentRows = await db
      .update(payments)
      .set({ status: "confirmed" })
      .where(eq(payments.id, paymentId))
      .returning();

    const payment = paymentRows[0];
    if (!payment) throw new Error("Payment not found");

    const leaseId = (payment.rawPayload as any)?.leaseId;
    if (!leaseId) throw new Error("Lease ID missing in payment");

    // 1️⃣ Get lease
    const lease = await db
      .select()
      .from(leases)
      .where(eq(leases.id, leaseId))
      .then((r) => r[0]);

    if (!lease) throw new Error("Lease not found");

    if (lease.status !== "processing_activation") {
      throw new Error("Lease is not in activation stage");
    }

    // 2️⃣ Activate lease
    await db
      .update(leases)
      .set({ status: "active" })
      .where(eq(leases.id, leaseId));

    // 3️⃣ Occupy unit
    await db
      .update(units)
      .set({ status: "occupied" })
      .where(eq(units.id, lease.unit_id));

    return payment;
  }

  static async rejectActivationPayment(paymentId: string) {
    const rows = await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, paymentId))
      .returning();

    return rows[0];
  }
}
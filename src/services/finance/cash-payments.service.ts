import { db } from "../../db/db";
import { payments, leases, units } from "../../db/schema";
import { eq } from "drizzle-orm";

export class CashPaymentsService {
  /**
   * Tenant declares activation cash payment
   */
  static async declareCashPayment(data: {
  leaseId: string;
  amount: string;
  userId: string;
  period: string;
}) {
  const paymentRows = await db
    .insert(payments)
    .values({
      leaseId: data.leaseId, // 👈 now stored properly
      method: "cash",
      reference: `activation-cash-${Date.now()}`,
      rawPayload: {
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
  static async confirmCashPayment(paymentId: string) {
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .then((r) => r[0]);

  if (!payment) throw new Error("Payment not found");

  if (!payment.leaseId) {
    throw new Error("Payment not linked to lease");
  }

  if (payment.status !== "pending") {
    throw new Error("Payment already processed");
  }

  // Confirm payment
  await db
    .update(payments)
    .set({ status: "confirmed" })
    .where(eq(payments.id, paymentId));

  const lease = await db
    .select()
    .from(leases)
    .where(eq(leases.id, payment.leaseId))
    .then((r) => r[0]);

  if (!lease) throw new Error("Lease not found");

  if (lease.status !== "processing_activation") {
    throw new Error("Lease not in activation stage");
  }

  // Activate lease
  await db
    .update(leases)
    .set({ status: "active" })
    .where(eq(leases.id, payment.leaseId));

  // Occupy unit
  await db
    .update(units)
    .set({ status: "occupied" })
    .where(eq(units.id, lease.unit_id));

  return payment;
}

  static async rejectCashPayment(paymentId: string) {
    const rows = await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.id, paymentId))
      .returning();

    return rows[0];
  }
}
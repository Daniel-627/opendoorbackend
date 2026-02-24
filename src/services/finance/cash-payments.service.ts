// services/finance/cash-payments.service.ts

import { db } from "../../db/db";
import { payments, leases, units } from "../../db/schema";
import { eq } from "drizzle-orm";
import { LedgerService } from "./ledger.service";

export class CashPaymentsService {
  static declareCashPayment(arg0: { leaseId: any; amount: any; userId: any; period: any; category: any; }) {
    throw new Error("Method not implemented.");
  }
  static rejectCashPayment(paymentIdParam: string) {
    throw new Error("Method not implemented.");
  }

  static async confirmCashPayment(paymentId: string) {

    return db.transaction(async (tx) => {

      const payment = await tx
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .then(r => r[0]);

      if (!payment) throw new Error("Payment not found");
      if (payment.status !== "pending") {
        throw new Error("Payment already processed");
      }

      const lease = await tx
        .select()
        .from(leases)
        .where(eq(leases.id, payment.leaseId))
        .then(r => r[0]);

      if (!lease) throw new Error("Lease not found");

      const unit = await tx
        .select()
        .from(units)
        .where(eq(units.id, lease.unit_id))
        .then(r => r[0]);

      if (!unit) throw new Error("Unit not found");

      const amount = payment.rawPayload.amount;
      const period = payment.rawPayload.period;

      // CATEGORY BUSINESS LOGIC
      if (payment.category === "activation") {

        if (lease.status !== "processing_activation") {
          throw new Error("Lease not in activation stage");
        }

        await tx.update(leases)
          .set({ status: "active" })
          .where(eq(leases.id, lease.id));

        await tx.update(units)
          .set({ status: "occupied" })
          .where(eq(units.id, lease.unit_id));
      }

      // 🔥 CREATE LEDGER ENTRY (INTERNAL)
      const ledgerPayload = {
        leaseId: lease.id,
        propertyId: unit.property_id,
        unitId: lease.unit_id,
        userId: lease.id,
        amount,
        category: payment.category,
        paymentId: payment.id,
        ...(period ? { period } : {}),
      };

await LedgerService.createPaymentEntry(tx, ledgerPayload);

      // Mark payment confirmed
      await tx.update(payments)
        .set({ status: "confirmed" })
        .where(eq(payments.id, paymentId));

      return payment;
    });
  }
}
// services/finance/ledger.service.ts

import { db } from "../../db/db";
import { ledgerEntries } from "../../db/schema";
import { eq } from "drizzle-orm";

export class LedgerService {

  /**
   * Create rent charge (tenant owes)
   */
  static async createCharge(data: {
    leaseId: string;
    propertyId: string;
    unitId: string;
    userId: string;
    amount: string;
    period: string;
    accountId?: string;
  }) {
    const [entry] = await db
      .insert(ledgerEntries)
      .values({
        leaseId: data.leaseId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        userId: data.userId,
        type: "charge",
        category: "rent",
        amount: data.amount,
        period: data.period,
        accountId: data.accountId,
      })
      .returning();

    return entry;
  }

  /**
   * INTERNAL: Create payment ledger entry
   * Should only be called from PaymentsService inside transaction
   */
  static async createPaymentEntry(tx: any, data: {
    leaseId: string;
    propertyId: string;
    unitId: string;
    userId: string;
    amount: string;
    period?: string;
    category: string;
    paymentId: string;
  }) {
    await tx.insert(ledgerEntries).values({
      leaseId: data.leaseId,
      propertyId: data.propertyId,
      unitId: data.unitId,
      userId: data.userId,
      type: "payment",
      category: data.category,
      amount: data.amount,
      period: data.period,
      reference: data.paymentId,
    });
  }

  static async listByLease(leaseId: string) {
    return db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.leaseId, leaseId))
      .orderBy(ledgerEntries.createdAt);
  }

  static async calculateBalance(leaseId: string) {
    const entries = await db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.leaseId, leaseId));

    let balance = 0;

    for (const entry of entries) {
      const amount = Number(entry.amount);

      if (entry.type === "charge") balance += amount;
      if (entry.type === "payment") balance -= amount;
      if (entry.type === "adjustment") balance += amount;
    }

    return { leaseId, balance };
  }
}
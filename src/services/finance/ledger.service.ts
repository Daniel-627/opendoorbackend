import { db } from "../../db/db";
import { ledgerEntries } from "../../db/schema";
import { eq, and } from "drizzle-orm";

export class LedgerService {
  /**
   * Create a rent charge (tenant owes)
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
   * Create a payment entry (manual, cash, bank, mpesa later)
   */
  static async createPayment(data: {
    leaseId: string;
    propertyId: string;
    unitId: string;
    userId: string;
    amount: string;
    period: string;
    accountId?: string;
    paymentId?: string;
  }) {
    const [entry] = await db
      .insert(ledgerEntries)
      .values({
        leaseId: data.leaseId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        userId: data.userId,
        type: "payment",
        category: "rent",
        amount: data.amount,
        period: data.period,
        accountId: data.accountId,
        reference: data.paymentId,
      })
      .returning();

    return entry;
  }

  /**
   * List ledger entries for a lease
   */
  static async listByLease(leaseId: string) {
    return db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.leaseId, leaseId))
      .orderBy(ledgerEntries.createdAt);
  }

  /**
   * Calculate balance for a lease
   * charge  => +
   * payment => -
   */
  static async calculateBalance(leaseId: string) {
    const entries = await db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.leaseId, leaseId));

    let balance = 0;

    for (const entry of entries) {
      const amount = Number(entry.amount);

      if (entry.type === "charge") {
        balance += amount;
      }

      if (entry.type === "payment") {
        balance -= amount;
      }

      if (entry.type === "adjustment") {
        balance += amount;
      }
    }

    return {
      leaseId,
      balance,
    };
  }
}

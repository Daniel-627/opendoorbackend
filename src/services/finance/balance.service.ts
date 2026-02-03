import { db } from "../../db/db";
import { ledgerEntries } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

export class BalanceService {
  /**
   * Get current balance for a lease
   * balance = debits - credits
   */
  static async getLeaseBalance(leaseId: string) {
    const rows = await db
      .select({
        type: ledgerEntries.type,
        total: sql<string>`SUM(${ledgerEntries.amount})`,
      })
      .from(ledgerEntries)
      .where(eq(ledgerEntries.leaseId, leaseId))
      .groupBy(ledgerEntries.type);

    let debit = 0;
    let credit = 0;

    for (const row of rows) {
      const amount = Number(row.total || 0);
      if (row.type === "expense" || row.type === "charge") debit += amount;
      if (row.type === "payment" || row.type === "adjustment") credit += amount;
    }

    return {
      debit,
      credit,
      balance: debit - credit,
    };
  }
}

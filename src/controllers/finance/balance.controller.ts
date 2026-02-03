import { Request, Response } from "express";
import { BalanceService } from "../../services/finance/balance.service";

export class BalanceController {
  /**
   * GET lease balance
   * GET /finance/balance/lease/:leaseId
   */
  static async getLeaseBalance(req: Request, res: Response) {
    try {
      const { leaseId } = req.params;

      // ✅ Type guard
      if (!leaseId || Array.isArray(leaseId)) {
        return res.status(400).json({
          message: "Invalid lease ID",
        });
      }

      const balance = await BalanceService.getLeaseBalance(leaseId);

      return res.status(200).json(balance);
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch lease balance",
        error: error.message,
      });
    }
  }
}

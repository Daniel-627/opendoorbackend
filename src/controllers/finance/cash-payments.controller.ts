import { Request, Response, NextFunction } from "express";
import { CashPaymentsService } from "../../services/finance/cash-payments.service";

export class CashPaymentsController {
  // Tenant
  static async declare(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await CashPaymentsService.declareCashPayment({
        leaseId: req.body.leaseId,
        amount: req.body.amount,
        userId: req.user!.id,
        period: req.body.period,
      });

      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  }

  // Owner / Manager
  static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = req.params.paymentId;
      if (typeof paymentId !== "string") {
        return res.status(400).json({ error: "paymentId is required" });
      }

      const payment = await CashPaymentsService.confirmCashPayment(paymentId);

      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentId = req.params.paymentId;
      if (typeof paymentId !== "string") {
        return res.status(400).json({ error: "paymentId is required" });
      }

      const payment = await CashPaymentsService.rejectCashPayment(paymentId);

      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
}

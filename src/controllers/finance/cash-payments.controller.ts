import { Request, Response, NextFunction } from "express";
import { CashPaymentsService } from "../../services/finance/cash-payments.service";

export class CashPaymentsController {

  // Tenant declares payment
  static async declare(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaseId, amount, period, category } = req.body;

      const payment = await CashPaymentsService.declareCashPayment({
        leaseId,
        amount,
        userId: req.user!.id,
        period,
        category,
      });

      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  }

  // Owner confirms payment
  static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentIdParam = req.params.paymentId;

      // Runtime + TypeScript safe validation
      if (!paymentIdParam || Array.isArray(paymentIdParam)) {
        return res.status(400).json({ error: "Invalid paymentId" });
      }

      const payment = await CashPaymentsService.confirmCashPayment(paymentIdParam);

      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  // Owner rejects payment
  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentIdParam = req.params.paymentId;

      // Runtime + TypeScript safe validation
      if (!paymentIdParam || Array.isArray(paymentIdParam)) {
        return res.status(400).json({ error: "Invalid paymentId" });
      }

      const payment = await CashPaymentsService.rejectCashPayment(paymentIdParam);

      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
}
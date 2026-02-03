import { Request, Response } from "express";
import { InvoicesService } from "../../services/finance/invoices.service";

export class InvoicesController {
  static async create(req: Request, res: Response) {
    const { leaseId } = req.params;
    if (typeof leaseId !== "string") {
      return res.status(400).json({ error: "leaseId is required" });
    }
    const { period, totalAmount } = req.body;

    const invoice = await InvoicesService.createInvoice(leaseId, {
      period,
      totalAmount,
    });

    res.status(201).json(invoice);
  }

  static async listByLease(req: Request, res: Response) {
    const { leaseId } = req.params;
    if (typeof leaseId !== "string") {
      return res.status(400).json({ error: "leaseId is required" });
    }

    const invoices = await InvoicesService.listByLease(leaseId);

    res.json(invoices);
  }

  static async issue(req: Request, res: Response) {
    const { invoiceId } = req.params;
    if (typeof invoiceId !== "string") {
      return res.status(400).json({ error: "invoiceId is required" });
    }

    const invoice = await InvoicesService.issue(invoiceId);

    res.json(invoice);
  }
}

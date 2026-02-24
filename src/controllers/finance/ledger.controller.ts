// controllers/finance/ledger.controller.ts

import { Request, Response } from "express";
import { LedgerService } from "../../services/finance/ledger.service";

export class LedgerController {

  static async createCharge(req: Request, res: Response) {
    const entry = await LedgerService.createCharge(req.body);
    res.status(201).json(entry);
  }

  static async listByLease(req: Request, res: Response) {
    const { leaseId } = req.params;

    if (!leaseId || Array.isArray(leaseId)) {
      return res.status(400).json({ error: "leaseId is required" });
    }

    const entries = await LedgerService.listByLease(leaseId);
    res.json(entries);
  }

  static async getBalance(req: Request, res: Response) {
    const { leaseId } = req.params;

    if (!leaseId || Array.isArray(leaseId)) {
      return res.status(400).json({ error: "leaseId is required" });
    }

    const balance = await LedgerService.calculateBalance(leaseId);
    res.json(balance);
  }
}
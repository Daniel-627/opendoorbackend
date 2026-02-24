// routes/finance/ledger.routes.ts

import { Router } from "express";
import { LedgerController } from "../../controllers/finance/ledger.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requireLeaseAccess } from "../../middleware/requireLeaseAccess";

const router = Router();

/**
 * Create rent charge (allowed)
 */
router.post(
  "/leases/:leaseId/charge",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  requireLeaseAccess(),
  LedgerController.createCharge
);

/**
 * View ledger
 */
router.get(
  "/leases/:leaseId",
  requireAuth,
  requireLeaseAccess(),
  LedgerController.listByLease
);

/**
 * Get balance
 */
router.get(
  "/leases/:leaseId/balance",
  requireAuth,
  requireLeaseAccess(),
  LedgerController.getBalance
);

export default router;
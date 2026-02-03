import { Router } from "express";
import { InvoicesController } from "../../controllers/finance/invoices.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requireLeaseAccess } from "../../middleware/requireLeaseAccess";

const router = Router();

/**
 * Create invoice for a lease
 */
router.post(
  "/leases/:leaseId/invoices",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  requireLeaseAccess(),
  InvoicesController.create
);

/**
 * List invoices for a lease
 */
router.get(
  "/leases/:leaseId/invoices",
  requireAuth,
  requireLeaseAccess(),
  InvoicesController.listByLease
);

/**
 * Issue invoice
 */
router.post(
  "/invoices/:invoiceId/issue",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  InvoicesController.issue
);

export default router;

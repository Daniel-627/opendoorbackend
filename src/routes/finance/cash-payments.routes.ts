import { Router } from "express";
import { CashPaymentsController } from "../../controllers/finance/cash-payments.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requireLeaseAccess } from "../../middleware/requireLeaseAccess";

const router = Router();

/**
 * Tenant declares cash payment
 */
router.post(
  "/payments/cash:leaseId",
  requireAuth,
  requireRole(["tenant"]),
  requireLeaseAccess(),
  CashPaymentsController.declare
);

/**
 * Owner / Manager confirms
 */
router.post(
  "/payments/cash/:paymentId/confirm",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  CashPaymentsController.confirm
);

router.post(
  "/payments/cash/:paymentId/reject",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  CashPaymentsController.reject
);

export default router;

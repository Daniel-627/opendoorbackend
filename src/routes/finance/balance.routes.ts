import { Router } from "express";
import { BalanceController } from "../../controllers/finance/balance.controller";

const router = Router();

/**
 * Finance → Balance
 */
router.get(
  "/lease/:leaseId",
  BalanceController.getLeaseBalance
);

export default router;

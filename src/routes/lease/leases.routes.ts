import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireLeaseAccess } from "../../middleware/requireLeaseAccess";
import { LeasesController } from "../../controllers/lease/leases.controller";

const router = Router();

router.get(
  "/leases/:leaseId",
  requireAuth,
  requireLeaseAccess(),
  LeasesController.getOne
);

router.patch(
  "/leases/:leaseId",
  requireAuth,
  requireLeaseAccess(),
  LeasesController.update
);

router.post(
  "/leases/:leaseId/terminate",
  requireAuth,
  requireLeaseAccess(),
  LeasesController.terminate
);

export default router;

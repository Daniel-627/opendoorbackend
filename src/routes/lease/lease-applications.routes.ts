import { Router } from "express";
import { LeasesController } from "../../controllers/lease/lease-applications.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requireApplicationAccess } from "../../middleware/requireApplicationAccess";

const router = Router();

router.post(
  "/applications/:applicationId/lease",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  requireApplicationAccess(),
  LeasesController.createFromApplication
);

export default router;

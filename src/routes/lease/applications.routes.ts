import { Router } from "express";
import { ApplicationsController } from "../../controllers/lease/applications.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requirePropertyAccess } from "../../middleware/requirePropertyAccess";

const router = Router();

/**
 * Tenant
 */
router.post(
  "/units/:unitId/apply",
  requireAuth,
  requireRole(["tenant"]),
  ApplicationsController.apply
);

/**
 * Owner / Manager
 */
router.get(
  "/properties/:propertyId/applications",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  requirePropertyAccess(),
  ApplicationsController.listForProperty
);

router.patch(
  "/applications/:applicationId/approve",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  ApplicationsController.approve
);

router.patch(
  "/applications/:applicationId/reject",
  requireAuth,
  requireRole(["owner", "manager", "admin"]),
  ApplicationsController.reject
);

export default router;

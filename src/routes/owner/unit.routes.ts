import { Router } from "express";
import { UnitsController } from "../../controllers/owner/units.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requirePropertyAccess } from "../../middleware/requirePropertyAccess";
import { requirePropertyOwner } from "../../middleware/requirePropertyOwner";
import { requireUnitAccess } from "../../middleware/requireUnitAccess";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["owner", "manager", "admin"]));

/**
 * Create unit (owner + manager)
 */
router.post(
  "/properties/:propertyId/units",
  requirePropertyAccess(),
  UnitsController.create
);

/**
 * List units (owner + manager)
 */
router.get(
  "/properties/:propertyId/units",
  requirePropertyAccess(),
  UnitsController.list
);

/**
 * Update unit (owner + manager of the unit's property)
 */
router.patch(
  "/units/:unitId",
  requireUnitAccess,
  UnitsController.update
);

/**
 * Delete unit (OWNER ONLY)
 */
router.delete(
  "/units/:unitId",
  requireUnitAccess,
  requirePropertyOwner(),
  UnitsController.remove
);

export default router;

import { Router } from "express";
import { UnitsController } from "../../controllers/owner/units.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requirePropertyAccess } from "../../middleware/requirePropertyAccess";
import { requirePropertyOwner } from "../../middleware/requirePropertyOwner";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["owner", "manager", "admin"]));

router.post(
  "/properties/:propertyId/units",
  requirePropertyAccess(),
  UnitsController.create
);

router.get(
  "/properties/:propertyId/units",
  requirePropertyAccess(),
  UnitsController.list
);

router.patch(
  "/units/:unitId",
  UnitsController.update
);

router.delete(
  "/units/:unitId",
  requirePropertyOwner(),
  UnitsController.remove
);

export default router;

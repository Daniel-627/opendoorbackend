import { Router } from "express";
import { OwnerPropertiesController } from "../../controllers/owner/properties.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";
import { requirePropertyOwner } from "../../middleware/requirePropertyOwner";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["owner", "admin"]));

router.post("/", OwnerPropertiesController.create);
router.get("/", OwnerPropertiesController.mine);

router.patch(
  "/:propertyId",
  requirePropertyOwner(),
  OwnerPropertiesController.update
);

router.delete(
  "/:propertyId",
  requirePropertyOwner(),
  OwnerPropertiesController.remove
);

export default router;

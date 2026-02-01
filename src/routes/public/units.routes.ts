import { Router } from "express";
import { PublicUnitsController } from "../../controllers/public/units.controller";

const router = Router();

router.get("/:unitId", PublicUnitsController.getOne);
router.get("/:unitId/details", PublicUnitsController.details);

export default router;

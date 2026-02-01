import { Router } from "express";
import { PublicPropertiesController } from "../../controllers/public/properties.controller";

const router = Router();

router.get("/", PublicPropertiesController.list);
router.get("/:propertyId", PublicPropertiesController.getOne);
router.get("/:propertyId/units", PublicPropertiesController.units);

export default router;

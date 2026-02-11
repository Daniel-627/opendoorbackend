import { Router } from "express";
import { UserRolesController } from "../../controllers/users/userRoles.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requireRole";

const router = Router();


router.use(requireAuth);
router.use(requireRole(["ADMIN"]));


router.post(
  "/:userId/roles",
  UserRolesController.assignRole
);


router.patch(
  "/:userId/roles/revoke",
  UserRolesController.revokeRole
);


router.get(
  "/:userId/roles",
  UserRolesController.getUserRoles
);

export default router;

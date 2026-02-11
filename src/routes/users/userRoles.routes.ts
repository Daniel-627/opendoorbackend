import { Router } from "express";
import { UserRolesController } from "../../controllers/users/userRoles.controller";
// import { requireAdmin } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * Admin role management
 */

// router.use(requireAdmin);  // Enable when middleware is ready

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

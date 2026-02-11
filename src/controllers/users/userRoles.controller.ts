import { Request, Response } from "express";
import { UserRolesService } from "../../services/users/userRoles.service";

export class UserRolesController {
  static async assignRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      const result = await UserRolesService.assignRole(userId, role);

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to assign role",
      });
    }
  }

  static async revokeRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const result = await UserRolesService.revokeRole(userId, role);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to revoke role",
      });
    }
  }

  static async getUserRoles(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const roles = await UserRolesService.getUserRoles(userId);

      return res.status(200).json(roles);
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch user roles",
      });
    }
  }
}

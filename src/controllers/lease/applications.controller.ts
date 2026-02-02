import { Request, Response, NextFunction } from "express";
import { ApplicationsService } from "../../services/lease/applications.service";

export class ApplicationsController {
  static async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;

      if (!unitId || Array.isArray(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }

      const application = await ApplicationsService.apply(
        unitId,
        req.user!.id
      );

      res.status(201).json(application);
    } catch (err) {
      next(err);
    }
  }
}

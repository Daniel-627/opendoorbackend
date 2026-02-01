import { Request, Response, NextFunction } from "express";
import { PublicUnitsService } from "../../services/public/units.services";

export class PublicUnitsController {
  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;

      if (!unitId || Array.isArray(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }

      const unit = await PublicUnitsService.getOne(unitId);
      res.json(unit);
    } catch (err) {
      next(err);
    }
  }

  static async details(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;

      if (!unitId || Array.isArray(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }

      const details = await PublicUnitsService.details(unitId);
      res.json(details);
    } catch (err) {
      next(err);
    }
  }
}

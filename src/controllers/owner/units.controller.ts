import { Request, Response, NextFunction } from "express";
import { UnitsService } from "../../services/owner/units.service";

export class UnitsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const unit = await UnitsService.create(propertyId, req.body);
      res.status(201).json(unit);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const units = await UnitsService.list(propertyId);
      res.json(units);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;

      if (!unitId || Array.isArray(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }

      const unit = await UnitsService.update(unitId, req.body);
      res.json(unit);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;

      if (!unitId || Array.isArray(unitId)) {
        return res.status(400).json({ message: "Invalid unit ID" });
      }

      await UnitsService.remove(unitId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

import { Request, Response, NextFunction } from "express";
import { PublicPropertiesService } from "../../services/public/properties.service";

export class PublicPropertiesController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await PublicPropertiesService.list();
      res.json(properties);
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await PublicPropertiesService.getOne(propertyId);
      res.json(property);
    } catch (err) {
      next(err);
    }
  }

  static async units(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const units = await PublicPropertiesService.units(propertyId);
      res.json(units);
    } catch (err) {
      next(err);
    }
  }
}

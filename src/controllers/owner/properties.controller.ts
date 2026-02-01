import { Request, Response, NextFunction } from "express";
import { OwnerPropertiesService } from "../../services/owner/properties.service";

export class OwnerPropertiesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await OwnerPropertiesService.create(
        req.user!,
        req.body
      );
      res.status(201).json(property);
    } catch (err) {
      next(err);
    }
  }

  static async mine(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await OwnerPropertiesService.mine(req.user!);
      res.json(properties);
    } catch (err) {
      next(err);
    }
  }


  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await OwnerPropertiesService.update(
        propertyId,
        req.body
      );

      return res.json(property); // Ensure a return statement here
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      if (!propertyId || Array.isArray(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      await OwnerPropertiesService.remove(propertyId);
      return res.status(204).send(); // Ensure a return statement here
    } catch (err) {
      next(err);
    }
  }
}

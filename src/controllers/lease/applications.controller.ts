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

  static async listForProperty(req: Request, res: Response, next: NextFunction) {
  try {
    const { propertyId } = req.params;

    if (!propertyId || Array.isArray(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const applications =
      await ApplicationsService.listForProperty(propertyId);

    res.json(applications);
  } catch (err) {
    next(err);
  }
}

static async approve(req: Request, res: Response, next: NextFunction) {
  try {
    const { applicationId } = req.params;

    if (!applicationId || Array.isArray(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application =
      await ApplicationsService.approve(applicationId);

    res.json(application);
  } catch (err) {
    next(err);
  }
}

static async reject(req: Request, res: Response, next: NextFunction) {
  try {
    const { applicationId } = req.params;

    if (!applicationId || Array.isArray(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application =
      await ApplicationsService.reject(applicationId);

    res.json(application);
  } catch (err) {
    next(err);
  }
}

}

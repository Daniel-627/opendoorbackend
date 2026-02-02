import { Request, Response, NextFunction } from "express";
import { LeasesService } from "../../services/lease/lease-applications.service";

export class LeasesController {
  static async createFromApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { applicationId } = req.params;

      if (!applicationId || Array.isArray(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const lease = await LeasesService.createFromApplication(
        applicationId,
        req.body
      );

      res.status(201).json(lease);
    } catch (err) {
      next(err);
    }
  }
}

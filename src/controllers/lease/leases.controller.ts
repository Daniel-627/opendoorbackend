import { Request, Response, NextFunction } from "express";
import { LeasesService } from "../../services/lease/leases.service";

declare global {
  namespace Express {
    interface Request {
      lease?: any;
      leaseRole?: string;
    }
  }
}

export class LeasesController {
  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(req.lease);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = req.lease;
      const role = req.leaseRole;

      if (lease.status !== "active") {
        return res.status(400).json({ message: "Cannot update inactive lease" });
      }

      if (role === "tenant") {
        return res.status(403).json({ message: "Tenants cannot update lease" });
      }

      const updated = await LeasesService.update(lease.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async terminate(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = req.lease;
      const role = req.leaseRole;

      if (lease.status !== "active") {
        return res.status(400).json({ message: "Lease is not active" });
      }

      if (role === "tenant") {
        return res.status(403).json({ message: "Tenants cannot terminate lease" });
      }

      const terminated = await LeasesService.terminate(lease.id);
      res.json(terminated);
    } catch (err) {
      next(err);
    }
  }
}

import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (err: any) {
      console.log("ZOD ERROR:", err);
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };

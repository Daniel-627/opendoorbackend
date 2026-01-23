import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.signup(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await AuthService.login(req.body);
      res.json(session);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response) {
    // req.user is set by requireAuth middleware
    res.json({ user: req.user });
  }

  static async logout(req: Request, res: Response) {
    await AuthService.logout(req.user.id, req.cookies.session_token);
    res.status(204).send();
  }
}


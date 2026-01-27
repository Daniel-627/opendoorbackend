import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import { users, user_roles } from "../db/schema";
import { eq } from "drizzle-orm";

interface JwtPayload {
  userId: string;
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 🔑 1. Read JWT from cookie (same place as before, different name)
    const token = req.cookies?.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No access token" });
    }

    // 🔐 2. Verify JWT
    let payload: JwtPayload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // 👤 3. Load user (same as before)
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId));

    const user = userRows[0];
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 🧾 4. Load roles (UNCHANGED)
    const roleRows = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, user.id));

    // ✅ 5. Attach user (same shape as before)
    req.user = {
      ...user,
      roles: roleRows.map(r => r.role),
    };

    return next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

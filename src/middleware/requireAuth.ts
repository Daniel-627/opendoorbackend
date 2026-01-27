import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { users, auth_sessions, user_roles } from "../db/schema";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No session token" });
    }

    const sessions = await db
      .select()
      .from(auth_sessions)
      .where(eq(auth_sessions.session_token, token));

    const session = sessions[0];
    if (!session) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ message: "Unauthorized: Session expired" });
    }

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user_id));

    const user = userRows[0];
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // ✅ ADD ROLES (only addition)
    const roleRows = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, user.id));

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

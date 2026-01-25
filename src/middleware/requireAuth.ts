import { Request, Response, NextFunction } from "express";
import { db } from "../db/db"; // Drizzle client
import { users, auth_sessions } from "../db/schema";
import { eq } from "drizzle-orm"; // 🔑 eq helper

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session_token; // cookie-parser must be used
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No session token" });
    }

    // Find session
    const sessions = await db
      .select()
      .from(auth_sessions)
      .where(eq(auth_sessions.session_token, token));

    const session = sessions[0]; // 🔑 pick first manually
    if (!session) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ message: "Unauthorized: Session expired" });
    }

    // Fetch user
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user_id));

    const user = userRows[0];
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request for downstream controllers
    req.user = user;

    return next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

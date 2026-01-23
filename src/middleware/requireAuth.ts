import { Request, Response, NextFunction } from "express";
import { db } from "../db/db"; // Your Drizzle client
import { users, auth_sessions } from "../db/schema"; // Optional: if using typed Drizzle tables

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session_token; // Make sure cookie-parser is used in app.ts
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No session token" });
    }

    // Find session
    const session = await db
      .select()
      .from(auth_sessions)
      .where(auth_sessions.session_token.eq(token))
      .first();

    if (!session) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ message: "Unauthorized: Session expired" });
    }

    // Fetch user
    const user = await db
      .select()
      .from(users)
      .where(users.id.eq(session.user_id))
      .first();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request for downstream controllers
    req.user = user;

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

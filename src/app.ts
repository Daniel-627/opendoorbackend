import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes";

export function createApp() {
  const app = express();

  // 🔑 Needed when using cookies behind proxies (Vercel, Render, etc.)
  app.set("trust proxy", 1);

  // Middleware order matters
  app.use(cors({
    origin: true,      // adjust later for frontend domain
    credentials: true, // 🔑 allow cookies
  }));

  app.use(express.json());

  // 🔑 Cookie parser MUST come before routes
  app.use(cookieParser());

  // Health / open route
  app.get("/open", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running" });
  });

  // Routes
  app.use("/auth", authRoutes);

  // Global error handler (last)
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

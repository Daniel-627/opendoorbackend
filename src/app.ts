import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1); // 🔑 important for auth cookies

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running 🚀" });
  });

  // 🔑 Mount auth routes under /auth
  app.use("/auth", authRoutes);

  // Global error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}


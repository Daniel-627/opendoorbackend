import express from "express";
import cors from "cors";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1); // 🔑 important for auth cookies

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running 🚀" });
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

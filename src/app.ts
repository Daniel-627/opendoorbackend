import express from "express";
import cors from "cors";

export function createApp() {
  const app = express();

  // Global middleware
  app.use(cors());
  app.use(express.json());

  // Health check (always useful)
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running 🚀" });
  });

  // Routes will go here later
  // app.use("/api", routes);

  // Error handler (placeholder)
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

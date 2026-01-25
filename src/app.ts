import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1); 

  app.use(cors());
  app.use(express.json());

  
  app.get("/open", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running " });
  });

  
  app.use("/auth", authRoutes);

  
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}


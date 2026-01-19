import dotenv from "dotenv";
import { createApp } from "./app";

dotenv.config();

export function startServer() {
  const app = createApp();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

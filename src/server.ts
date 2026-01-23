import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";

export function startServer() {
  const app = createApp();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

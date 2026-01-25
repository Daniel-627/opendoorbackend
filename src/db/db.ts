// src/db/index.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false } // Neon / Supabase / Railway
      : undefined,
});


export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});


export async function connectDB() {
  try {
    // Force an initial connection
    await pool.query("SELECT 1");
    console.log("DB connected via Drizzle");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  console.log("Closing database pool...");
  await pool.end();
}

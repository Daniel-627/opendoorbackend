import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Import all tables from schema/index.ts
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

// Pass schema to Drizzle so it knows about all tables
export const db = drizzle(pool, { schema });

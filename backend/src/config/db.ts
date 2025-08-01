// config/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../models/schema";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

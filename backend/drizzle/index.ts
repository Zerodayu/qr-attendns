import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";

// Initialize PGLite with file-based persistence
const pglite = new PGlite(process.env.DATABASE_URL || "./database/pglite.db");

// Create Drizzle client
export const db = drizzle(pglite);

export default db;

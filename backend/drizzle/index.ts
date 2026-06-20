import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

const pglite = new PGlite(process.env.DATABASE_URL || "./database/pglite.db");

export const db = drizzle(pglite, { schema });

export default db;

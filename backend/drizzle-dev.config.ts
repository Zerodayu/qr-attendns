import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema/*",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: "./database/pglite.db",
  },
});

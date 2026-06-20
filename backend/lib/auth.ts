import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/drizzle/index";
// import * as schema from "@/drizzle/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    // schema, // gives the adapter visibility into user, session, account, etc.
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "parent",
        input: false, // prevents users from self-assigning "teacher" at signup
      },
    },
  },
});

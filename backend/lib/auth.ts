import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/drizzle/index";
import { serial } from "drizzle-orm/pg-core";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    // schema, // gives the adapter visibility into user, session, account, etc.
  }),

  emailAndPassword: {
    enabled: true,
    password: {
      hash: (pass) => Bun.password.hash(pass),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },

  advanced: {
    database: {
      generateId: "serial",
    },
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

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});

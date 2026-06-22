import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, username } from "better-auth/plugins";
import { env } from "@env";
import db from "../../drizzle";
import { user, session, account, verification } from "../../drizzle/schema";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),

  plugins: [openAPI(), username()],

  emailAndPassword: {
    enabled: true,
    password: {
      hash: (pass) => Bun.password.hash(pass),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },

  advanced: {
    database: {
      generateId: false,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "parent",
        input: false,
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

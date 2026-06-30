import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/auth",
});

export type SessionData = typeof authClient.$Infer.Session;

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().min(1),
  VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),
  VAPID_EMAIL: z.string().min(1),
  XENDIT_SECRET_API_KEY: z.string().min(1),
  XENDIT_WEBHOOK_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);

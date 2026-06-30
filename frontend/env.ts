import { z } from "zod";

const envSchema = z.object({
  DEV_ENV: z
    .preprocess((v) => v === "true" || v === true, z.boolean())
    .default(false),
  API_URL: z.url().default("http://localhost:8080"),
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:8080"),
  NEXT_PUBLIC_VAPID_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.parse({
  DEV_ENV: process.env.DEV_ENV,
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
});

export const env = parsed;
export const API_URL = parsed.API_URL;

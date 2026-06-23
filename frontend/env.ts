import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string()
    .url()
    .default("http://localhost:8080"),
  NEXT_PUBLIC_VAPID_KEY: z.string().min(1).optional(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
})

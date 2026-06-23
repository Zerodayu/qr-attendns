import { z } from "zod"

const envSchema = z.object({
  API_URL: z.url().min(1),
  NEXT_PUBLIC_API_URL: z.url().min(1),
  NEXT_PUBLIC_VAPID_KEY: z.string().min(1).optional(),
})

const parsed = envSchema.parse({
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
})

export const env = parsed
export const API_URL = parsed.API_URL

// lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  SONAR_KEY: z.string().nonempty(),
  // …add other vars here
})

const _env = envSchema.safeParse(process.env)
if (!_env.success) {
  console.error("Invalid environment: ", _env.error.format())
  throw new Error("Environment validation failed")
}

export const env = _env.data
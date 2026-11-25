import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('Invalid backend environment configuration:', result.error.flatten().fieldErrors)
  throw new Error('Backend environment configuration is invalid.')
}

export const env = result.data
export const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)

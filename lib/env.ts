import { z } from 'zod'
import 'dotenv/config'

export const envSchema = z.object({
  TOKEN: z.string(),
  GUILD_ID: z.string(),
  CHANNEL_ID: z.string(),
  CLIENT_ID: z.string(),
  CONOHA_USERNAME: z.string(),
  CONOHA_PASSWORD: z.string(),
  TENANT_ID: z.string(),
  SERVER_ID: z.string(),
})

export const env = envSchema.parse(process.env)

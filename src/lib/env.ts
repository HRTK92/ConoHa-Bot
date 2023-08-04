import 'dotenv/config'
import { z } from 'zod'

export const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  CONOHA_USERNAME: z.string(),
  CONOHA_PASSWORD: z.string(),
  TENANT_ID: z.string(),
  SERVER_ID: z.string(),
  SERVER_IP: z.string(),
  STEAM_WEB_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)

import { configDotenv } from "dotenv"

configDotenv()

export const ADMIN_USER_ID = Number(process.env.ADMIN_USER_ID)
export const MONGODB_DATABASE_URL = process.env.MONGODB_DATABASE_URL
export const BOT_TOKEN = process.env.BOT_TOKEN
export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN
export const SERVER_PORT = process.env.SERVER_PORT
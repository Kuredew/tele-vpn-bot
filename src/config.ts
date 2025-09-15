import { configDotenv } from "dotenv"

configDotenv()

export const ADMIN_USER_ID = Number(process.env.ADMIN_USER_ID)
export const MONGODB_DATABASE_URL = process.env.MONGODB_DATABASE_URL
export const BOT_TOKEN = process.env.BOT_TOKEN
export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN
export const SERVER_PORT = process.env.SERVER_PORT

export const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH
export const CERTIFICATE_PATH = process.env.CERTIFICATE_PATH
export const CA_BUNDLE_PATH = process.env.CA_BUNDLE_PATH
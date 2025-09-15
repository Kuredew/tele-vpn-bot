import { Telegraf } from "telegraf"
import { BOT_TOKEN, CA_BUNDLE_PATH, CERTIFICATE_PATH, MONGODB_DATABASE_URL, PRIVATE_KEY_PATH, SERVER_PORT, WEBHOOK_DOMAIN } from "config"
import { exit } from "process"

import registerHandlers from "registerHandlers"
import mongoose from "mongoose"
import express from "express"
import https from "https"
import { readFileSync } from "fs"

if (!BOT_TOKEN || !MONGODB_DATABASE_URL || !SERVER_PORT) {
    console.log("ABORTED. Make sure you've set .env correctly")
    exit()
}

const dbURL = MONGODB_DATABASE_URL
const bot = new Telegraf(BOT_TOKEN)
const app = express()

registerHandlers(bot)

mongoose.connect(dbURL)
    .then(async () => {
        if (!WEBHOOK_DOMAIN || !PRIVATE_KEY_PATH || !CERTIFICATE_PATH || !CA_BUNDLE_PATH) {
            console.log('ABORTED. .ENV IS NOT VALID.')
            return
        }

        app.use(await bot.createWebhook( { domain: WEBHOOK_DOMAIN }))
        const server = https.createServer({
            key: readFileSync(PRIVATE_KEY_PATH, 'utf-8'),
            cert: readFileSync(CERTIFICATE_PATH, 'utf-8'),
            ca: readFileSync(CA_BUNDLE_PATH, 'utf-8')
        }, app)

        server.listen(SERVER_PORT, () => {
            console.log("Bot berjalan...");
        })
    })

// graceful shutdown
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
import { Telegraf } from "telegraf"
import { BOT_TOKEN, MONGODB_DATABASE_URL, SERVER_PORT, WEBHOOK_DOMAIN } from "config"
import { exit } from "process"

import registerHandlers from "registerHandlers"
import mongoose from "mongoose"
import express from "express"
import https from "https"

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
        if (!WEBHOOK_DOMAIN) {
            console.log('ABORTED. WEBHOOK_DOMAIN IS NOT VALID.')
            return
        }

        const webhookPath = await bot.createWebhook( { domain: WEBHOOK_DOMAIN })

        app.use(webhookPath)
        const server = https.createServer({}, app)
        server.listen(SERVER_PORT, () => {
            console.log("Bot berjalan...");
        })
    })

// graceful shutdown
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
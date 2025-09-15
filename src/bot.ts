import { Telegraf } from "telegraf"
import { APP_ENV, BOT_TOKEN, CA_BUNDLE_PATH, CERTIFICATE_PATH, MONGODB_DATABASE_URL, PRIVATE_KEY_PATH, SERVER_PORT, WEBHOOK_DOMAIN } from "config"
import { exit } from "process"

import registerHandlers from "registerHandlers"
import mongoose from "mongoose"
import express from "express"
import https from "https"
import { readFileSync } from "fs"

if (!BOT_TOKEN || !MONGODB_DATABASE_URL) {
    console.log("ABORTED. Make sure you've set .env correctly")
    exit()
}

const dbURL = MONGODB_DATABASE_URL
const bot = new Telegraf(BOT_TOKEN)
const app = express()

registerHandlers(bot)

async function startProduction() {
    if (!WEBHOOK_DOMAIN || !PRIVATE_KEY_PATH || !CERTIFICATE_PATH || !CA_BUNDLE_PATH || !SERVER_PORT) {
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
    })
}

function startDevelompent() {
    bot.launch()    
}

function main() {
    mongoose.connect(dbURL)
        .then(() => {
            switch (APP_ENV) {
                case 'production':
                    startProduction()
                case 'development':
                    startDevelompent()
            }

            console.log("Bot berjalan...");
        })
}


main()


// graceful shutdown
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
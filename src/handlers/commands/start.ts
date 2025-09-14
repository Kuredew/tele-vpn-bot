import { homeHandler } from "handlers/actions/home";
import { Telegraf } from "telegraf";

export default function startCommand(bot: Telegraf) {
    bot.start((ctx) => {
        homeHandler(ctx) 
    })
}
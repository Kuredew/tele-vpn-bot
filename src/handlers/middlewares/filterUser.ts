import { ADMIN_USER_ID } from "config";
import { Telegraf } from "telegraf";
import { callbackQuery, message } from "telegraf/filters";

export default function filterUserMiddleware(bot: Telegraf) {
    bot.on(callbackQuery('data'), (ctx, next) => {
        ctx.answerCbQuery()

        if (ctx.from.id != ADMIN_USER_ID) {
            ctx.editMessageText('Mau ngapain bang? 😂')
            return
        }

        next()
    })

    bot.on(message('text'), (ctx, next) => {
        if (ctx.from.id != ADMIN_USER_ID) {
            ctx.reply('Mau ngapain bang? 😂')
            return
        }

        next()
    })
}
import resetState from "handlers/utils/resetState";
import { Telegraf } from "telegraf";

export default function resetAction(bot: Telegraf) {
    bot.action('reset', (ctx) => {
        resetState(ctx.from.id)

        ctx.answerCbQuery()
        ctx.reply('Session kamu dihapus.')
    }) 
}
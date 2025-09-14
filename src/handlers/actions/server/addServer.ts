import homeButtonMarkup from "handlers/utils/markup/homeButton";
import state from "state";
import { Telegraf } from "telegraf";

export default function addServerAction(bot: Telegraf) {
    bot.action('add_server', (ctx) => {
        const userState = state.get(ctx.from.id)
        if (userState) {
            userState.flow = 'addServer'
            userState.step = 'askProvider'
        }
        ctx.editMessageText('Masukkan provider Server.\nContoh\n"SG DigitalOcean"\n\nProvider server akan dimasukkan kedalam template message ketika kamu membuat/memperbarui akun VPN', homeButtonMarkup())
    })
}
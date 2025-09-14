import protocolButtonMarkup from "handlers/utils/markup/protocolButton";
import state from "state";
import { Telegraf } from "telegraf";

export default function renewAccountAction(bot: Telegraf) {
    bot.action('renew_account', (ctx) => {
        const userState = state.get(ctx.from.id)
        if (!userState) return

        userState.flow = 'renewAccount'
        userState.step = 'askProtocol'

        ctx.editMessageText(
            'Pilih Protocol akun yang ingin kamu perpanjang.',
            protocolButtonMarkup()
        )
    })
}
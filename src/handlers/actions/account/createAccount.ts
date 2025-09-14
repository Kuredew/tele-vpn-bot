import protocolButtonMarkup from "handlers/utils/markup/protocolButton";
import state from "state";
import { Telegraf } from "telegraf";

export default function createAccountAction(bot: Telegraf) {
    bot.action('create_account', (ctx) => {
        const userState = state.get(ctx.from.id)
        if (!userState) return

        userState.flow = 'createAccount'
        userState.step = 'askProtocol'

        ctx.editMessageText(
            'Pilih Protocol akun yang ingin kamu buat.',
            protocolButtonMarkup()
        )
    })
}
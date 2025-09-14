import protocolButtonMarkup from "handlers/utils/markup/protocolButton";
import state from "state";
import { Telegraf } from "telegraf";

export default function deleteAccountAction(bot: Telegraf) {
    bot.action('delete_account', (ctx) => {
        const userState = state.get(ctx.from.id)
        if (!userState) return

        userState.flow = 'deleteAccount'
        userState.step = 'askProtocol'

        ctx.editMessageText(
            'Pilih Protocol akun yang ingin kamu hapus.',
            protocolButtonMarkup()
        )
    })
}
import { homeButtonCallback } from "handlers/utils/markup/homeButton";
import { UserState } from "state";
import { Context, Markup } from "telegraf";

export default function addServerMessageFlow(ctx: Context, userState: UserState) {
    const { message } = ctx

    if (!('text' in message!)) return
    const userInput = message.text

    const messageButtons = Markup.inlineKeyboard([
        Markup.button.callback('Batal', 'reset')
    ])

    if (userState?.step == 'askProvider') {
        userState.server.provider = userInput
        userState.step = 'askDomain'
        ctx.reply('Masukkan Domain', messageButtons)
        return
    }

    if (userState?.step == 'askDomain') {
        userState.server.domain = userInput
        userState.step = 'askAuth'
        ctx.reply('Masukkan Auth', messageButtons)
        return
    }

    if (userState?.step == 'askAuth') {
        userState.server.auth = userInput
        userState.step = 'addServer'

        const messageButtons = Markup.inlineKeyboard([
                [ Markup.button.callback('Konfirmasi 🆗', 'konfirmasi') ], 
                homeButtonCallback
            ])

        ctx.reply(`
Konfirmasi informasi berikut :

┌────────────────
<b>Provider</b> : ${userState.server.provider}
<b>Domain</b> : ${userState.server.domain}
<b>Auth</b> : ${userState.server.auth}
└────────────────

Konfirmasi untuk melanjutkan
            `, { parse_mode:'HTML', ...messageButtons})
    } 
}
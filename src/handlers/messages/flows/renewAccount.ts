import { homeButtonCallback } from "handlers/utils/markup/homeButton";
import { UserState } from "state";
import { Context, Markup } from "telegraf";

export default async function renewAccountMessageFlow(ctx: Context, userState: UserState) {
    const { message } = ctx

    if (!('text' in message!)) return
    const userInput = message.text

    const messageButtons = Markup.inlineKeyboard([
        Markup.button.callback('Batal', 'reset')
    ])

    if (userState.step == 'askExpired') {
        const expired = Number(userInput)

        if (!expired) {
            ctx.reply('Masukkan Hanya Angka!, masukkan Expired lagi', messageButtons)
            return
        }

        userState.account.expiredDay = expired
        userState.step = 'askIpLimit'
        ctx.reply('Masukkan Ip Limit', messageButtons)
        return
    }

    if (userState?.step == 'askIpLimit') {
        const ipLimit = Number(userInput)
        
        if (!ipLimit) {
            ctx.reply('Masukkan Hanya Angka!, masukkan Ip Limit lagi', messageButtons)
            return
        }

        userState.account.ipLimit = ipLimit
        userState.step = 'renewAccount'

        ctx.reply(`
Konfirmasi informasi berikut

┌────────────────
<b>Username</b> : ${userState.account.username} ${userState.account.password? `\n<b>Password</b> : ${userState.account.password}`: '' }
<b>Protocol VPN</b> : ${userState.account.vpnProtocol}
<b>Expired Ditambah</b> : ${userState.account.expiredDay} Hari
<b>Ip Limit</b> : ${userState.account.ipLimit}
└────────────────

Silahkan Konfirmasi untuk melanjutkan
        `, { parse_mode:'HTML', ...Markup.inlineKeyboard([
                [ Markup.button.callback('Konfirmasi 🆗', 'konfirmasi') ], 
                homeButtonCallback
                ])
        })
    }
}
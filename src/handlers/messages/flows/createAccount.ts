import getDateAfter from "handlers/utils/getDateAfter";
import serverButtonMarkup from "handlers/utils/markup/serverButton";
import { UserState } from "state";
import { Context, Markup } from "telegraf";

export default async function createAccountMessageFlow(ctx: Context, userState: UserState) {
    const { message } = ctx

    if (!('text' in message!)) return
    const userInput = message.text

    const messageButtons = Markup.inlineKeyboard([
        Markup.button.callback('Batal', 'reset')
    ])

    if (userState.account.vpnProtocol == 'ssh' && userState.step == 'askUsername') {
        userState.account.username = userInput
        userState.step = 'askPassword'
        ctx.reply('Masukkan Password yang diinginkan', messageButtons)
        return
    }

    if (userState?.step == 'askUsername') {
        userState.account.username = userInput
        userState.step = 'askExpired'
        ctx.reply('Masukkan Day Expired (Hanya Angka)', messageButtons)
        return
    }

    if (userState.step == 'askPassword') {
        userState.account.password = userInput
        userState.step = 'askExpired'
        ctx.reply('Masukkan Day Expired (Hanya Angka)', messageButtons)
        return
    }

    if (userState?.step == 'askExpired') {
        const expired = Number(userInput)

        if (!expired) {
            ctx.reply('Masukkan hanya angka!, masukkan Expired lagi', messageButtons)
            return
        }

        userState.account.expiredDay = expired
        userState.account.expiredAt = getDateAfter(expired, null)
        userState.step = 'askIpLimit'
        ctx.reply('Masukkan Ip Limit (Hanya Angka)', messageButtons)
        return
    }

    if (userState?.step == 'askIpLimit') {
        const ipLimit = Number(userInput)
        
        if (!ipLimit) {
            ctx.reply('Masukkan Hanya Angka!, masukkan Ip Limit lagi', messageButtons)
            return
        }

        userState.account.ipLimit = Number(userInput)
        userState.step = 'createAccount'

        const serverMessageButtons = await serverButtonMarkup()
        ctx.reply(`
Konfirmasi informasi berikut

┌────────────────
<b>Username</b> : ${userState.account.username} ${userState.account.password? `\n<b>Password</b> : ${userState.account.password}`: '' }
<b>Protocol VPN</b> : ${userState.account.vpnProtocol}
<b>Expired Dalam</b> : ${userState.account.expiredDay} Hari
<b>Ip Limit</b> : ${userState.account.ipLimit}
└────────────────

Silahkan pilih server dibawah ini untuk melanjutkan.
        `, { parse_mode:'HTML', ...serverMessageButtons})
    }
}
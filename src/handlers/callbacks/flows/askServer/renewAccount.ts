import accountButtonMarkup from "handlers/utils/markup/accountButton";
import { UserState } from "state";
import { Context } from "telegraf";

export default async function askServerRenewAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    ctx.answerCbQuery()

    userState.step = 'askAccount'
    userState.account.serverDomain = callbackQData
    
    const buttons = await accountButtonMarkup(userState.account.vpnProtocol!, userState.account.serverDomain)

    if (buttons) {
        ctx.editMessageText(
            'Pilih akun yang ingin kamu perpanjang',
            buttons
        )
        return
    }

    ctx.editMessageText('Tidak ada akun yang ditemukan.')

}
import accountButtonMarkup from "handlers/utils/markup/accountButton";
import { UserState } from "state";
import { Context } from "telegraf";

export default async function askServerDeleteAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    ctx.answerCbQuery()

    userState.step = 'deleteAccount'
    userState.account.serverDomain = callbackQData
    
    const buttons = await accountButtonMarkup(userState.account.vpnProtocol!, userState.account.serverDomain)

    if (buttons) {
        ctx.editMessageText(
            'Pilih akun yang ingin kamu hapus',
            buttons
        )
        return
    }

    ctx.editMessageText('Tidak ada akun yang ditemukan.')

}
import serverButtonMarkup from "handlers/utils/markup/serverButton";
import { UserState } from "state";
import { Context } from "telegraf";

export default async function askProtocolDeleteAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    ctx.answerCbQuery()

    userState.step = 'askServer'
    userState.account.vpnProtocol = callbackQData
    
    ctx.editMessageText(
        'Akun dari server mana yang ingin kamu hapus?',
        await serverButtonMarkup()
    )
}
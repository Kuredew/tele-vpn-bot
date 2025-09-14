import homeButtonMarkup from "handlers/utils/markup/homeButton";
import { UserState } from "state";
import { Context } from "telegraf";

export default function askProtocolCreateAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    ctx.answerCbQuery()

    userState.step = 'askUsername'
    userState.account.vpnProtocol = callbackQData
    
    ctx.editMessageText(
        'Masukkan Username',
        homeButtonMarkup()
    )
}
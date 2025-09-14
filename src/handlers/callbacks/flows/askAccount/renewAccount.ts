import accountButtonMarkup from "handlers/utils/markup/accountButton";
import homeButtonMarkup from "handlers/utils/markup/homeButton";
import { UserState } from "state";
import { Context } from "telegraf";

export default async function askAccountRenewAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    ctx.answerCbQuery()

    userState.step = 'askExpired'
    userState.account.username = callbackQData

    ctx.editMessageText('Masukkan Expired Baru (Hanya Angka)', homeButtonMarkup())
}
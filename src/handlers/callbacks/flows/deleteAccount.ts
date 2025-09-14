import homeButtonMarkup from "handlers/utils/markup/homeButton";
import resetState from "handlers/utils/resetState";
import ServerModel from "models/server";
import deleteAccountService from "services/deleteAccount";
import { UserState } from "state";
import { Context } from "telegraf";

export default async function deleteAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    const server = await ServerModel.findOne({ domain: userState.account.serverDomain })

    if (!server) return

    userState.account.username = callbackQData

    ctx.editMessageText('Menghapus Akun...')

    deleteAccountService(server, userState.account, (result: Error | null) => {
        if (result instanceof Error) {
            ctx.editMessageText(result.message, homeButtonMarkup())
        }

        ctx.editMessageText(
            `Akun "${callbackQData}" berhasil dihapus.`,
            homeButtonMarkup()
        )

        resetState(ctx.from?.id)
    })


}
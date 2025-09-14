import homeButtonMarkup from "handlers/utils/markup/homeButton";
import resetState from "handlers/utils/resetState";
import { ResponseInterface } from "models/response";
import ServerModel from "models/server";
import renewAccountService from "services/renewAccount";
import { UserState } from "state";
import { Context } from "telegraf";
import sshMessageTemplate from "templates/renewAccount/sshMessage";
import xrayMessageTemplate from "templates/renewAccount/xrayMessage";

export default async function renewAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    const server = await ServerModel.findOne({ domain: userState.account.serverDomain })

    if (!server) return

    ctx.editMessageText('Memperpanjang Akun...')

    renewAccountService(server, userState.account, (response: ResponseInterface | Error ) => {
        if (response instanceof Error) {
            ctx.editMessageText(`Perpanjang akun gagal!\n\nPesan error:\n  ${response.message}`, homeButtonMarkup())
            return
        }
        let finalMessageText : string

        if (userState.account.vpnProtocol == 'ssh') finalMessageText = sshMessageTemplate(response)
        else finalMessageText = xrayMessageTemplate(response)

        ctx.editMessageText(
            finalMessageText,
            { parse_mode: "HTML" }
        )

        resetState(ctx.from?.id)
    })


}
import { ResponseInterface } from "models/response";
import { UserState } from "state";
import { Context } from "telegraf";

import createAccountService from "services/createAccount";
import xrayMessageTemplate from "templates/createAccount/xrayMessage";

import serverModel from "models/server";
import homeButtonMarkup from "handlers/utils/markup/homeButton";
import resetState from "handlers/utils/resetState";
import sshMessageTemplate from "templates/createAccount/sshMessage";

export default async function createAccountCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    const domainServer = callbackQData

    ctx.editMessageText('Membuat akun...')
    userState.account.serverDomain = domainServer

    const server = await serverModel.findOne({ domain: domainServer })
    if (!server) return

    createAccountService(server, userState.account, (response: ResponseInterface | Error) => {
        if (response instanceof Error) {
            ctx.editMessageText(`Pembuatan akun gagal!\n\nPesan error:\n  ${response.message}`, homeButtonMarkup())
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
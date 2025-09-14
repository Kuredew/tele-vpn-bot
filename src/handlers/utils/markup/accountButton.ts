import AccountModel from "models/account";
import { Markup } from "telegraf";

export default async function accountButtonMarkup(vpnProtocol: string, domainServer: string) {
    const accounts = await AccountModel.find({
        vpnProtocol: vpnProtocol,
        serverDomain: domainServer
    })

    const buttons = []

    for (const account of accounts) {
        if (!account.username) return

        buttons.push([ Markup.button.callback(account.username, account.username) ]) 
    }

    buttons.push([ Markup.button.callback('Kembali Ke Home 🏡', 'home') ])

    if (buttons.length > 0) {
        return Markup.inlineKeyboard(buttons)
    }

    return null
}
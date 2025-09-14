import serverModel from "models/server";
import { Markup } from "telegraf";

export default async function serverButtonMarkup() {

    const servers = await serverModel.find()

    const buttons = []

    for (const server of servers) {
        if (!server.domain) return

        const serverButton = [ Markup.button.callback(server.domain, server.domain) ]
        buttons.push(serverButton)
    }

    buttons.push([ Markup.button.callback('Kembali Ke Home 🏡', 'home') ])

    return Markup.inlineKeyboard(buttons)
}
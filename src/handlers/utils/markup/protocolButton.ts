import { Markup } from "telegraf";

export default function protocolButtonMarkup() {
    const buttons = [
        [ Markup.button.callback('VMESS 🔑', 'vmess') ],
        [ Markup.button.callback('VLESS 🔑', 'vless') ],
        [ Markup.button.callback('TROJAN 🔑', 'trojan') ],
        [ Markup.button.callback('SSH 🔑', 'ssh') ],
        [ Markup.button.callback('Kembali Ke Home 🏡', 'home') ],
    ]

    return Markup.inlineKeyboard(buttons)
}
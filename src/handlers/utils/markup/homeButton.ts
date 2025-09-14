import { Markup } from "telegraf";

export const homeButtonCallback = [
        Markup.button.callback('Kembali Ke Home 🏡', 'home')
    ]

export default function homeButtonMarkup() {
    return Markup.inlineKeyboard(homeButtonCallback)
}
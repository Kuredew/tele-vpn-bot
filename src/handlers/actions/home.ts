import resetState from "handlers/utils/resetState"
import AccountModel from "models/account"
import ServerModel from "models/server"
import { Context, Markup, Telegraf } from "telegraf"

export async function homeHandler(ctx: Context) {
    resetState(ctx.from?.id)

    const totalAccountCreated = await AccountModel.countDocuments()
    const totalServer = await ServerModel.countDocuments()

    const messageText = `
Halo ${ctx.from!.username}, Selamat datang di Yubisaki (DebuVPN) Store Bot!

┌────────────────
Total Account Active : ${totalAccountCreated}
Total Server Added : ${totalServer}
└────────────────

Silahkan pilih menu dibawah ini:
            `

    const messageButton = Markup.inlineKeyboard([
                [
                    Markup.button.callback('Buat Akun 🚀', 'create_account'),
                    Markup.button.callback('Delete Akun ❌', 'delete_account')
                ],
                [
                    Markup.button.callback('Renew Akun 🥀', 'renew_account'),
                    Markup.button.callback('List Server 📝', 'list_server')
                ]
            ])

    if (ctx.callbackQuery) {
        ctx.editMessageText(
            messageText,
            messageButton
        )
        return
    }
    ctx.reply(
        messageText, 
        messageButton
    )

}

export default function homeAction(bot: Telegraf) {
    bot.action('home', (ctx) => { ctx.answerCbQuery(); homeHandler(ctx) })
}
import serverModel from "models/server";
import { Markup, Telegraf } from "telegraf";

export default function listServerAction(bot: Telegraf) {
    bot.action('list_server', async (ctx) => {
        let text = 'Berikut list server yang tersimpan dalam database kami.\n'

        const servers = await serverModel.find()
        
        servers.map((result, index) => {
            if (!result.domain) return

            text += `\n${index + 1}. ${result.domain}`
        })

        ctx.editMessageText(
            text,
            Markup.inlineKeyboard([
                [ Markup.button.callback('Tambah Server 🔐', 'add_server') ],
                [ Markup.button.callback('Delete Server ❌', 'delete_server') ],
                [ Markup.button.callback('Kembali Ke Home 🏡', 'home') ]
            ])
        )
    })
}
import serverButtonMarkup from "handlers/utils/markup/serverButton";
import state from "state";
import { Telegraf } from "telegraf";

export default function deleteServerAction(bot: Telegraf) {
    bot.action('delete_server', async (ctx) => {
        const userState = state.get(ctx.from.id)

        if (!userState) return

        userState.flow = 'deleteServer'
        userState.step = 'deleteServer'

        const buttons = await serverButtonMarkup()
        ctx.editMessageText(
            'Pilih server dibawah ini yang ingin kamu hapus',
            buttons
        )
    })
}
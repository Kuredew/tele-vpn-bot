import { Context } from "telegraf";

import deleteServerService from "services/deleteServer";
import { UserState } from "state";
import homeButtonMarkup from "handlers/utils/markup/homeButton";
import resetState from "handlers/utils/resetState";

export default function deleteServerCallbackFlow(ctx: Context, callbackQData: string, userState: UserState) {
    userState.server.domain = callbackQData

    ctx.editMessageText('Menghapus server dari database...')

    deleteServerService(userState.server, (result: Error | null) => {
        if (result instanceof Error) {
            ctx.editMessageText('Gagal menghapus server dari database', homeButtonMarkup())
            return
        }

        ctx.editMessageText('Server berhasil dihapus dari database.', homeButtonMarkup())

        resetState(ctx.from?.id)
    })
}
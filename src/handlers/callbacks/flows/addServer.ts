import { Context } from "telegraf";

import { UserState } from "state";
import homeButtonMarkup from "handlers/utils/markup/homeButton";
import resetState from "handlers/utils/resetState";
import addServerService from "services/addServer";

export default function addServerCallbackFlow(ctx: Context, userState: UserState) {
    ctx.editMessageText('Memasukkan server ke database...')

    addServerService(userState.server, (result: Error | null) => {
        if (result instanceof Error) {
            ctx.editMessageText('Gagal Memasukkan server ke database', homeButtonMarkup())
            return
        }

        ctx.editMessageText('Server berhasil dimasukken ke database.', homeButtonMarkup())

        resetState(ctx.from?.id)
    })
}
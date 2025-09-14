import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import state from "state";

import createAccountMessageFlow from "./flows/createAccount";
import addServerMessageFlow from "./flows/addServer";
import renewAccountMessageFlow from "./flows/renewAccount";

export default function globalMessage(bot: Telegraf) {
    bot.on(message('text'), (ctx, next) => {

        const userState = state.get(ctx.from.id)

        if (userState?.flow == 'createAccount') createAccountMessageFlow(ctx, userState)

        else if (userState?.flow == 'renewAccount') renewAccountMessageFlow(ctx, userState)

        else if (userState?.flow == 'addServer') addServerMessageFlow(ctx, userState)

        next()
    })
}
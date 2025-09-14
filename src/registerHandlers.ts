import { Telegraf } from "telegraf";

import startCommand from "handlers/commands/start";

import globalMessage from "handlers/messages/global";
import globalCallback from "handlers/callbacks/global";

import createAccountAction from "handlers/actions/account/createAccount";

import resetAction from "handlers/actions/reset";

import listServerAction from "handlers/actions/server/listServer";
import addServerAction from "handlers/actions/server/addServer";
import deleteServerAction from "handlers/actions/server/deleteServer";
import deleteAccountAction from "handlers/actions/account/deleteAccount";
import homeAction from "handlers/actions/home";
import filterUserMiddleware from "handlers/middlewares/filterUser";
import renewAccountAction from "handlers/actions/account/renewAccount";

export default function registerHandlers(bot: Telegraf) {
    filterUserMiddleware(bot)

    startCommand(bot)
    homeAction(bot)
    resetAction(bot)

    listServerAction(bot)
    addServerAction(bot)
    deleteServerAction(bot)

    createAccountAction(bot)
    deleteAccountAction(bot)
    renewAccountAction(bot)

    globalMessage(bot)
    globalCallback(bot)
}
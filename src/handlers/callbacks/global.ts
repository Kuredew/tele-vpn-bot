import { Telegraf } from "telegraf"
import { callbackQuery } from "telegraf/filters"

import state from "state"

import createAccountCallbackFlow from "./flows/createAccount"
import deleteServerCallbackFlow from "./flows/deleteServer"
import askProtocolDeleteAccountCallbackFlow from "./flows/askProtocol/deleteAccount"
import askProtocolCreateAccountCallbackFlow from "./flows/askProtocol/createAccount"
import deleteAccountCallbackFlow from "./flows/deleteAccount"
import askServerDeleteAccountCallbackFlow from "./flows/askServer/deleteAccount"
import addServerCallbackFlow from "./flows/addServer"
import askProtocolRenewAccountCallbackFlow from "./flows/askProtocol/renewAccount"
import askServerRenewAccountCallbackFlow from "./flows/askServer/renewAccount"
import askAccountRenewAccountCallbackFlow from "./flows/askAccount/renewAccount"
import renewAccountCallbackFlow from "./flows/renewAccount"

export default function globalCallback(bot: Telegraf) {
    bot.on(callbackQuery('data'), (ctx, next) => {
        ctx.answerCbQuery()

        const userState = state.get(ctx.from.id)
        const callbackQData = ctx.callbackQuery.data

        if (!userState) return

        // Hellnah, awaokwkwk if ifan gini
        else if (userState.flow == 'createAccount' && userState.step == 'askProtocol') askProtocolCreateAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'createAccount' && userState.step == 'createAccount') createAccountCallbackFlow(ctx, callbackQData, userState)

        else if (userState.flow == 'renewAccount' && userState.step == 'askProtocol') askProtocolRenewAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'renewAccount' && userState.step == 'askServer') askServerRenewAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'renewAccount' && userState.step == 'askAccount') askAccountRenewAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'renewAccount' && userState.step == 'renewAccount') renewAccountCallbackFlow(ctx, callbackQData, userState)
        
        else if (userState.flow == 'deleteAccount' && userState.step == 'askProtocol') askProtocolDeleteAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'deleteAccount' && userState.step == 'askServer') askServerDeleteAccountCallbackFlow(ctx, callbackQData, userState)
        else if (userState.flow == 'deleteAccount' && userState.step == 'deleteAccount') deleteAccountCallbackFlow(ctx, callbackQData, userState)

        else if (userState.flow == 'addServer' && userState.step == 'addServer') addServerCallbackFlow(ctx, userState)
        else if (userState.flow == 'deleteServer' && userState.step == 'deleteServer') deleteServerCallbackFlow(ctx, callbackQData, userState)

        next()
    })
}
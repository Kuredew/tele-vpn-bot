import filterObj from "handlers/utils/filterObj";
import getDateAfter from "handlers/utils/getDateAfter";
import AccountModel, { AccountInterface } from "models/account";
import { ResponseInterface } from "models/response";
import { ServerInterface } from "models/server";

export default async function renewAccountService(server: ServerInterface, account: AccountInterface, callback: Function) {
    const urlServer = `http://${server.domain}:5888/renew${account.vpnProtocol}`
    const urlParameter = `?user=${account.username}&exp=${account.expiredDay}&quota=0&iplimit=${account.ipLimit}&auth=${server.auth}`
    const accountModel = await AccountModel.findOne(filterObj(account))

    if (!accountModel) { console.log('SERVICE:: Account not found in database. aborted '); return }

    const finalUrl = urlServer + urlParameter
    console.log(`Fetching VPN Server to Renew Account\n  ${finalUrl}`)
    try {
        const response = await fetch(finalUrl, { method: 'GET' })

        console.log(response)
        if (!response.ok) {
            callback(Error('Response Bukan 200OK'))
            return
        }

        const responseJson = await response.json()
        console.log(JSON.stringify(responseJson))
        
        if (responseJson['status'] != 'success') {
            callback(Error('Server tidak mau memperbarui akun, pastikan Authentikasi server/Akun benar.'))
            return
        }

        console.log('SERVICE:: Account successfully renewed in VPN Server')

        // Betulin bang, males gw njir
        const responseObject: ResponseInterface = {
            provider: server.provider,
            username: responseJson.data['username'],
            password: responseJson.data['password'],
            uuid: responseJson.data['uuid'],
            non_tls: null,
            tls: null,
            grpc: null,
            expired: responseJson.data['exp'],
            ip_limit: responseJson.data['limitip']
        }
        callback(responseObject)

        accountModel.expiredAt = getDateAfter(account.expiredDay!, accountModel.expiredAt)
        accountModel.save()
            .then(() => {
                console.log('SERVICE:: Account Saved to Database.')
            })
    } catch (e) {
        // TODO disini catch error.
        console.log(`SERVICE:: Error while fetching to server :\n  ${e}`)
        callback(Error(`${e}`))
    }

}
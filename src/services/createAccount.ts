import filterObj from "handlers/utils/filterObj"
import AccountModel, { AccountInterface } from "models/account"
import { ResponseInterface } from "models/response"
import { ServerInterface } from "models/server"

export default async function createAccountService(server: ServerInterface, account: AccountInterface, callback: Function) {
    console.log('SERVICE:: Preparing saving account to database...')
    const urlServer = `http://${server.domain}:5888/create${account.vpnProtocol}`
    const urlParameter = `?user=${account.username}${account.vpnProtocol == 'ssh' ? `&password=${account.password}`: ''}&exp=${account.expiredDay}&quota=0&iplimit=${account.ipLimit}&auth=${server.auth}`
    const accountModel = new AccountModel(account)

    const finalUrl = urlServer + urlParameter
    console.log(`SERVICE:: Fetching VPN Server to create New Account...\n  ${finalUrl}`)
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
            callback(Error('Server tidak mau membuat akun, pastikan Authentikasi server/Akun benar.'))
            return
        }

        console.log('SERVICE:: Account successfully created in VPN Server')

        // Betulin bang, males gw njir
        const responseObject: ResponseInterface = {
            provider: server.provider,
            username: responseJson.data['username'],
            password: responseJson.data['password'],
            uuid: responseJson.data['uuid'],
            non_tls: responseJson.data[`${account.vpnProtocol}_nontls_link`],
            tls: responseJson.data[`${account.vpnProtocol}_tls_link`],
            grpc: responseJson.data[`${account.vpnProtocol}_grpc_link`],
            expired: responseJson.data['expired'],
            ip_limit: responseJson.data['ip_limit']
        }
        callback(responseObject)

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
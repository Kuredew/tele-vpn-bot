import filterObj from "handlers/utils/filterObj";
import AccountModel, { AccountInterface } from "models/account";
import { ServerInterface } from "models/server";

export default async function deleteAccountService(server: ServerInterface, account: AccountInterface, callback: Function) {
    const urlServer = `http://${server.domain}:5888/delete${account.vpnProtocol}`
    const urlParam = `?user=${account.username}&auth=${server.auth}`
    const accountModel = await AccountModel.findOne(filterObj(account))

    if (!accountModel) { console.log('SERVICE:: Account not found in database. aborted '); return }

    const finalUrl = urlServer + urlParam
    console.log(`SERVICE:: Fetching vpn server to delete account\n  ${finalUrl}`)

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
            callback(Error('Server tidak mau menghapus akun, pastikan Authentikasi server/Akun benar.'))
            return
        }

        console.log('SERVICE:: Account successfully deleted from VPN Server')
        
        accountModel.deleteOne()
            .then(() => {
                console.log('SERVICE:: Account successfully deleted from database')
                callback()
            })
            .catch((e) => {
                console.log('SERVICE:: Failed delete account from database')
                callback(Error(`Akun gagal dihapus dari database, namun berhasil dihapus dari Server VPN\n\nKesalahan : \n${e}`))
            })
    } catch (e) {
        callback(Error(`Gagal terhubung ke server VPN, Proses dibatalkan\n\nKesalahan : \n${e}`))
    }


}
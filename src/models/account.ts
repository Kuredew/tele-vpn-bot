import mongoose from "mongoose"

export interface AccountInterface {
    username: string | null,
    password: string | null,
    expiredDay: number | null,
    vpnProtocol: string | null,
    ipLimit: number | null,
    serverDomain: string | null,
    expiredAt: Date | null
}

const AccountSchema = new mongoose.Schema<AccountInterface>({
    username: String,
    password: String,
    expiredDay: Number,
    vpnProtocol: String,
    ipLimit: Number,
    serverDomain: String,
    expiredAt: {
        type: Date,
        expires: 0
    }
}, { timestamps: true })

const AccountModel = mongoose.model('Account', AccountSchema)

export default AccountModel
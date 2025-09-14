import mongoose from "mongoose"

export interface ServerInterface {
    provider: string | null,
    domain: string | null,
    auth: string | null
}

const serverSchema = new mongoose.Schema<ServerInterface>({
    provider: String,
    domain: String,
    auth: String
})

const ServerModel = mongoose.model('Servers', serverSchema)
export default ServerModel 
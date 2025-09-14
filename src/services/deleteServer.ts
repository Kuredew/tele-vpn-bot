
import filterObj from "handlers/utils/filterObj";
import serverModel, { ServerInterface } from "models/server";

export default function deleteServerService(server: ServerInterface, callback: Function) {
    serverModel.deleteOne(filterObj(server))
        .then(() => {
            callback()
        })
        .catch((e) => {
            callback(Error(e))
        })

}
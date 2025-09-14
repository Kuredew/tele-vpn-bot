import serverModel, { ServerInterface } from "models/server";

export default function addServerService(server: ServerInterface, callback: Function) {
    console.log('SERVICE:: Preparing saving server to database...')
    const servermodel = new serverModel(server)

    servermodel.save()
        .then(() => {
            console.log('SERVICE:: Server Added to Database')
            callback()
        })
}
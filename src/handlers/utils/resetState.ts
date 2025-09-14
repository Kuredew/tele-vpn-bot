import state from "state";

export default function resetState(key: number | undefined) {
    if (!key) return

    state.set(key, {
        flow: null,
        step: null,
        account: {
            username: null,
            password: null, 
            expiredDay: null,
            vpnProtocol: null,
            ipLimit: null,
            serverDomain: null,
            expiredAt: null
        },
        server: {
            provider: null,
            domain: null,
            auth: null
        }
    }) 

    console.log('STATE:: Resetted.')
}
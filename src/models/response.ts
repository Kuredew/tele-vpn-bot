export interface ResponseInterface {
    provider: string | null
    username: string | null
    password: string | null
    uuid: string | null
    non_tls: string | null
    tls: string | null
    grpc: string | null
    expired: string | null
    ip_limit: string | null
}
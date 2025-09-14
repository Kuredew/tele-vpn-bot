import { ResponseInterface } from "models/response";

export default function xrayMessageTemplate(responseObject: ResponseInterface): string {
    return `
Pembuatan Akun Berhasil!

🌟 INFORMASI AKUN 🌟
◇━━━━━━━━━━━━━━◇
🔹 <b>Username :</b> ${responseObject['username']}
🔹 <b>UUID/Password :</b> ${responseObject['uuid']}
🔹 <b>Provider :</b> ${responseObject['provider']}
🔹 <b>Port TLS :</b> 443
🔹 <b>Port HTTP :</b> 80
🔹 <b>Network :</b> Websocket (WS)
◇━━━━━━━━━━━━━━◇
🔒 Non TLS :
<blockquote><code>${responseObject['non_tls']}</code></blockquote>

🔒 TLS :
<blockquote><code>${responseObject['tls']}</code></blockquote>

🔒 GRPC :
<blockquote><code>${responseObject['grpc']}</code></blockquote>
◇━━━━━━━━━━━━━━◇
┌────────────────
│ <b>Expired :</b> ${responseObject['expired']}
│ <b>Max Device :</b> ${responseObject['ip_limit']}
└────────────────

Selamat menikmati layanan kami 🎉
    `
}
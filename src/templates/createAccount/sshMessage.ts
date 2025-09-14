import { ResponseInterface } from "models/response";

export default function sshMessageTemplate(responseObject: ResponseInterface): string {
    return `
Pembuatan SSH Berhasil!

🌟 INFORMASI AKUN 🌟
◇━━━━━━━━━━━━━━◇
🔹 <b>Username :</b> ${responseObject['username']}
🔹 <b>Password :</b> ${responseObject['password']}
🔹 <b>Provider :</b> ${responseObject['provider']}
🔹 <b>Port TLS :</b> 443
🔹 <b>Port HTTP :</b> 80
🔹 <b>Network :</b> Websocket (WS)
◇━━━━━━━━━━━━━━◇
🔒 WS Payload :
<blockquote><code>GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: Websocket[crlf]Connection: Keep-Alive[crlf][crlf]</code></blockquote>

◇━━━━━━━━━━━━━━◇
┌────────────────
│ <b>Expired :</b> ${responseObject['expired']}
│ <b>Max Device :</b> ${responseObject['ip_limit']}
└────────────────

Selamat menikmati layanan kami 🎉
    `
}
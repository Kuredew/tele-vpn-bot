import { ResponseInterface } from "models/response";

export default function xrayMessageTemplate(responseObject: ResponseInterface): string {
    return `
Perpanjangan VPN Berhasil

🌟 INFORMASI AKUN 🌟
◇━━━━━━━━━━━━━━◇
🔹 <b>Username :</b> ${responseObject['username']}
🔹 <b>Provider :</b> ${responseObject['provider']}
🔹 <b>Port TLS :</b> 443
🔹 <b>Port HTTP :</b> 80
🔹 <b>Network :</b> Websocket (WS)
◇━━━━━━━━━━━━━━◇
┌────────────────
│ <b>Expired :</b> ${responseObject['expired']}
│ <b>Max Device :</b> ${responseObject['ip_limit']}
└────────────────

Selamat menikmati layanan kami 🎉
    `
}
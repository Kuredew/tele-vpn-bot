# tele-vpn-bot

Bot VPN Telegram untuk autoscript FighterTunnel.

## About

Setelah gw dapet experience bug dari Bot default script Fightertunnel yang dimana gw dapet tombol yang selalu stuck alias diem, gw akhirnya bikin Bot Telegram sendiri aja dengan dalih kalo bot ini anti bug awwowkkwkw.

Bot ini ditulis dengan Typescript dan lumayan dibikin *terlalu* modular, bot ini juga menggunakan Mongo untuk penyimpanan datanya, karena gw lebih milih database no sql.

Bot ini gak berkaitan dengan project Fightertunnel dan tidak terafiliasi, gw nulis bot ini karena ingin belajar ngoding rapih dan terstruktur dengan baik, apalagi gw nulis nya di typescript yang ketat bgt soal beginian.

Udh yappingnya.

## Fitur - fitur

- Semua fitur bot default Fightertunnel termasuk dalam bot ini
- Menggunakan Webhook, alias gk ada polling polling yang gak efisien dan bikin lag
- Tidak ada lagi bug tombol yang loading, stuck, atau ngaco
- Gampang buat di maintaine bagi para Dev Bot.
- Gampang juga buat dimodif agar sesuain sama autoscript lain, tinggal sesuaikan dengan API yang disediakan oleh autoscript kalian (lihat bagian [services](https://github.com/Kuredew/tele-vpn-bot/tree/next-dev/src/services)).

## Installation

Instalasi sebenarnya mudah bgt bagi yang tau gmn cara kerja node sebelumnya, tinggal atur .env aja dengan bener.

1. Pertama, ofc, clone project ini di VPS Kalian 

```
> git clone https://github.com/Kuredew/tele-vpn-bot.git
> cd tele-vpn-bot/
```

2. Buat file .env, masukin ini

```dotenv
APP_ENV = production // atau 'developement'

ADMIN_USER_ID = // taruh chat id kalian disini, pakai bot rose buat dapetinnya

MONGODB_DATABASE_URL = // taruh API database mongo kalian disini, bisa pake atlas atau hosting sendiri gk masalah
BOT_TOKEN = // taruh BOT Token kalian disini, didapetin dari BotFather, kalian harus bikin bot dulu sebelumnya.

WEBHOOK_PATH = https://serverku.my.id:443/ // ganti pakai domain server VPS kalian, server VPS yang menjalankan bot ini ya, bukan server VPN nya
SERVER_PORT = 443 // atau 8443, terserah.

PRIVATE_KEY_PATH = // taruh jalur file private key sertifikat SSL
CERTIFICATE_PATH = // taruh jalur file sertifikat SSL
CA_BUNDLE_PATH = // taruh jalur file sertifikat bundle nya
```

3. Jalanin pake Node.js

```
> node dist/bot.js
```

4. Kirim /start di bot kalian, ntar bakalan muncul pesan dashboard.

## Bantuan

Bantuan bisa tanya aja ke [Telegram](https://t.me/zeanetstd) gw 

## License

Lisensi pake [MIT](https://github.com/Kuredew/tele-vpn-bot/blob/next-dev/LICENSE.md), bebas dah mau diapain aja.
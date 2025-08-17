import services.vpn.vmess
import services.vpn.vless
import services.vpn.trojan

import utils
import config
import telebot

def register_handler(bot: telebot.TeleBot):
    @bot.message_handler(func= lambda message: True)
    def handler(message):
        if message.from_user.is_bot:
            return
        
        chat_id = message.chat.id
        if str(chat_id) !=  config.ADMIN_ID:
            bot.send_message(chat_id, f"Kamu bukan admin DebuVPN")
            return
        
        incoming_message = message.text
        if incoming_message.startswith("ping"):
            bot.send_message(chat_id, "Aku Siap.")
            return


        # handle pesan .create
        if incoming_message.startswith(".create"):
            bot.send_message(chat_id, "Membuat Akun...")

            argument = utils.parse_create_argument(incoming_message)

            if not argument:
                bot.send_message(chat_id, "Tidak bisa memparse argumen, silahkan ketik dengan benar.")
                return
            
            # Pisahin protokol
            response = None
            if argument["vpn_protocol"] == "vmess":
                response = services.vpn.vmess.create(argument)
            elif argument["vpn_protocol"] == "vless":
                response = services.vpn.vless.create(argument)
            elif argument["vpn_protocol"] == "trojan":
                response = services.vpn.trojan.create(argument)

            if not response:
                print("HANDLER : Error GET Response")
                bot.send_message(chat_id, "Tidak bisa mendapatkan respon dari server, silahkan coba lagi.")
                return

            if response["status"] != "success":
                bot.send_message(chat_id, f"Gagal ({response["message"]})")
                return
            
            msg_template = utils.parse_create_v2ray_template(response)
            bot.send_message(chat_id, msg_template, parse_mode='HTML')
            return
        
        # handle pesan .delete
        if incoming_message.startswith(".delete"):
            bot.send_message(chat_id, "Menghapus Akun...")

            argument = utils.parse_delete_argument(incoming_message)

            if not argument:
                bot.send_message(chat_id, "Tidak bisa memparse argumen, silahkan ketik dengan benar.")
                return
            
            # Pisahin protokol
            response = None
            if argument["vpn_protocol"] == "vmess":
                response = services.vpn.vmess.delete(argument)
            elif argument["vpn_protocol"] == "vless":
                response = services.vpn.vless.delete(argument)
            elif argument["vpn_protocol"] == "trojan":
                response = services.vpn.trojan.delete(argument)

            if not response:
                bot.send_message(chat_id, "Tidak bisa menghapus akun, coba lagi.")
                return
            
            if response["status"] != "success":
                bot.send_message(chat_id, f"Gagal ({response["message"]})")
                return
            
            bot.send_message(chat_id, f"Berhasil Menghapus Akun {argument["username"]}")

        # handle pesan .delete
        if incoming_message.startswith(".renew"):
            bot.send_message(chat_id, "Memperpanjang Akun...")

            argument = utils.parse_renew_argument(incoming_message)

            if not argument:
                bot.send_message(chat_id, "Tidak bisa memparse argumen, silahkan ketik dengan benar.")
                return
            
            # Pisahin protokol
            response = None
            if argument["vpn_protocol"] == "vmess":
                response = services.vpn.vmess.renew(argument)
            elif argument["vpn_protocol"] == "vless":
                response = services.vpn.vless.renew(argument)
            elif argument["vpn_protocol"] == "trojan":
                response = services.vpn.trojan.renew(argument)

            if not response:
                bot.send_message(chat_id, "Tidak bisa memperpanjang akun, coba lagi.")
                return
            
            if response["status"] != "success":
                bot.send_message(chat_id, f"Gagal ({response["message"]})")
                return
            
            msg_template = utils.parse_renew_v2ray_template(response)
            bot.send_message(chat_id, msg_template, parse_mode='HTML')
            return

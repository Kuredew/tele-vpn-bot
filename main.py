import config
from core.bot import bot
from handlers.message import message_handler
from telebot import types

from flask import Flask, request

app = Flask(__name__)

bot.remove_webhook()
bot.set_webhook(url=config.WEBHOOK_URL)

@app.route("/", methods=['POST'])
def update():

    json = request.get_data().decode('utf-8')
    updates = types.Update.de_json(json)

    bot.process_new_updates([updates])
    return 'ok', 200


message_handler.register_handler(bot)
print("MAIN : Bot Started")
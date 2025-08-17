from core.bot import bot
from handlers.message import message_handler

def launch():
    message_handler.register_handler(bot)

    print("MAIN : Bot Started")
    bot.polling()

if __name__ == "__main__":
    launch()
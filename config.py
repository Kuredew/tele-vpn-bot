import dotenv, os


dotenv.load_dotenv()

SERVER=os.getenv("SERVER")
PROVIDER=os.getenv("PROVIDER")
AUTH=os.getenv("AUTH")
BOT_TOKEN=os.getenv('BOT_TOKEN')
ADMIN_ID=os.getenv('ADMIN_ID')
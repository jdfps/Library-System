import os
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB = os.getenv("MONGODB_DB", "library_system")

client = AsyncMongoClient(MONGODB_URL)
db = client[MONGODB_DB]

books_collection = db["books"]

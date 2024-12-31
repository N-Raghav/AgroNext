from flask import Flask
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['cow_monitoring']
task_collection = db['tasks']

# Routes


if __name__ == '__main__':
    app.run(debug=True)

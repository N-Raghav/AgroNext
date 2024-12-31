from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from api import task_bp, init_task_collection

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['cow_monitoring']
task_collection = db['tasks']

# Register the Blueprint
app.register_blueprint(task_bp)

# Setip collection for API
init_task_collection(task_collection)

if __name__ == '__main__':
    app.run(debug=True)
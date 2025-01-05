from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import requests
from datetime import datetime

# Define the Blueprint for the 'cycle' API
cycle_bp = Blueprint('cycle', __name__)

# MongoDB collection reference for cycle data
cycle_collection = None

# Function to initialize MongoDB collection for cycle data
def init_cycle_collection(collection):
    """Initialize the MongoDB collection to use for cycle data."""
    global cycle_collection
    cycle_collection = collection

# API endpoint to create or update cycle entry (POST)
@cycle_bp.route('/cycles', methods=['POST'])
def create_or_update_cycle():
    data = request.json  # Receive JSON data from the request

    # Extract the parameters from the incoming request data
    name = data.get("name")
    animal_type = data.get("animal_type")
    breed = data.get("breed")
    internal_id = data.get("internal_id")
    estrous_start_date = data.get("estrous_start_date")
    estrous_end_date = data.get("estrous_end_date")

    # Convert estrous start and end dates from string to datetime objects
    estrous_start_date = datetime.fromisoformat(estrous_start_date) if isinstance(estrous_start_date, str) else estrous_start_date
    estrous_end_date = datetime.fromisoformat(estrous_end_date) if isinstance(estrous_end_date, str) else estrous_end_date

    # Calculate cycle length by finding the difference in days between start and end dates
    cycle_length = (estrous_end_date - estrous_start_date).days

    # Create the cycle data record to insert or update
    cycle_data = {
        "name": name,
        "animal_type": animal_type,
        "breed": breed,
        "internal_id": internal_id,
        "estrous_start_date": estrous_start_date,
        "estrous_end_date": estrous_end_date,
        "cycle_length": cycle_length
    }

    # Update or insert the cycle data (upsert operation)
    result = cycle_collection.replace_one(
        {"name": name},  # Search for the cycle by 'name'
        cycle_data,  # New data
        upsert=True  # If not found, insert a new record
    )

    response = requests.get(f'http://127.0.0.1:5000/predict_estrus/{name}')

    if result.matched_count > 0:
        return jsonify({
            "message": "Cycle data updated successfully", 
            "cycle_id": str(result.upserted_id) if result.upserted_id else name
        }), 200
    else:
        return jsonify({
            "message": "Cycle data created successfully", 
            "cycle_id": name
        }), 201

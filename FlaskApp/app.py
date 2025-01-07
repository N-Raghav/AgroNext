from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import api

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import pickle
from tensorflow.keras.models import load_model

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['cow_monitoring']

task_collection = db['tasks']
animal_collection = db['animals']
cow_collection = db['CowData']
cycle_collection = db['cycle_data']
predicted_collection = db['predicted_cycle']

# Register the Blueprint
app.register_blueprint(api.task_bp)
app.register_blueprint(api.animal_bp)
app.register_blueprint(api.cow_data_bp)
app.register_blueprint(api.cycle_bp)

# Setip collection for API
api.init_task_collection(task_collection)
api.init_animal_collection(animal_collection)
api.init_cow_data_collection(cow_collection)
api.init_cycle_collection(cycle_collection)

# Initialize model and scaler files
model = load_model('estrus_heat_prediction_model.h5')
with open('scaler.pkl', 'rb') as scaler_file:
    loaded_scaler = pickle.load(scaler_file)

# Function for preprocessing cow data
def preprocess_cow_data(cow_id):
    cow_data = pd.DataFrame(list(cow_collection.find()))
    cow_data_dict = {cow_id: cow_data[cow_data['slave_id'] == cow_id] for cow_id in cow_data['slave_id'].unique()}

    def create_record_from_data(cow_data):
        grouped = cow_data.groupby('timestamp')
        records = []

        for timestamp, group in grouped:
            record = {'timestamp': timestamp}
            for _, row in group.iterrows():
                record[row['parameter']] = row['value']
            records.append(record)
        
        return pd.DataFrame(records).ffill()

    df = pd.DataFrame(columns=['timestamp', 'slave_id', 'body_temperature', 'activity_level', 'milk_production', 'body_condition_score', 'feed_intake', 'rumen_ph'])
    
    # Preprocess data for the specific cow
    for i in cow_data_dict:
        new_record = create_record_from_data(cow_data_dict[i])
        new_record['slave_id'] = i
        latest_record = new_record.loc[new_record['timestamp'].idxmax()]
        df = pd.concat([df, pd.DataFrame([latest_record])], ignore_index=True)

    return df

# Function to get previous estrous day from the cycle_data collection
def get_previous_estrous_day(cow_id):
    cycle_data = cycle_collection.find_one({"name": cow_id})
    if cycle_data and "cycle_length" in cycle_data:
        return cycle_data["cycle_length"]
    return 21  # Default value if not found

# Function to predict estrous cycle day
def predict_estrus_heat(input_data):
    """Predict estrus heat date given input features."""
    # Ensure input_data is a 2D array for prediction
    input_data = np.array(input_data).reshape(1, -1)
    scaled_data = loaded_scaler.transform(input_data)  # Scale the data using the loaded scaler
    prediction = model.predict(scaled_data)
    return prediction.flatten()[0]

# API to predict estrous cycle days for a specific cow
@app.route('/predict_estrus/<cow_id>', methods=['GET'])
def predict_estrus_cycle(cow_id):
    # Step 1: Preprocess data for the cow
    df = preprocess_cow_data(cow_id)

    # Step 2: Extract input data (body temperature, activity level, rumen pH, etc.)
    input_features = df[['body_temperature', 'activity_level', 'rumen_ph', 'milk_production', 'feed_intake', 'body_condition_score']].iloc[0].values

    # Get previous estrous cycle day (assuming part of the cow data)
    previous_estrus_day = get_previous_estrous_day(cow_id)

    # Add the previous estrous day as the last input
    input_data = np.append(input_features, previous_estrus_day)

    # Step 3: Make prediction
    predicted_cycle_day = float(predict_estrus_heat(input_data))

    # Fetch the latest estrous_end_date from the cycle_data collection
    cycle_data = cycle_collection.find_one({"name": cow_id}, sort=[("estrous_end_date", -1)])
    if not cycle_data or "estrous_end_date" not in cycle_data:
        return jsonify({"error": "estrous_end_date not found for the cow"}), 400

    estrous_end_date = cycle_data["estrous_end_date"]  # Already a datetime object if stored as such in MongoDB

    # Calculate the predicted_date by adding the predicted_cycle_day (converted to timedelta)
    predicted_date = estrous_end_date + timedelta(days=int(predicted_cycle_day))

    # Create a record to store in the "predicted_cycle" collection
    predicted_cycle_record = {
        "cow_id": cow_id,
        "predicted_estrous_cycle_day": predicted_cycle_day,
        "predicted_date": predicted_date,
        "timestamp": datetime.now(),  # Timestamp of the prediction
    }

    # Insert or update the predicted cycle in the "predicted_cycle" collection
    predicted_collection.replace_one(
        {"cow_id": cow_id},  # Match by cow_id to ensure one record per cow
        predicted_cycle_record,
        upsert=True  # If record with cow_id exists, update it; else, insert new
    )

    # Return the predicted estrous cycle day and predicted date as response
    return jsonify({
        "cow_id": cow_id,
        "predicted_estrous_cycle_day": predicted_cycle_day,
        "predicted_date": predicted_date.isoformat()  # Return in ISO format
    }), 200


@app.route('/predicted/<cow_id>', methods=['GET'])
def get_cow_by_id(cow_id):
    # Find the cow from the collection using the cow_id
    cow = predicted_collection.find_one({'cow_id': cow_id})
    
    if cow:
        # Remove '_id' field for better response format
        cow['_id'] = str(cow['_id'])
        return jsonify(cow), 200  # Return cow data with status 200 (OK)
    else:
        return jsonify({'error': 'Cow not found'}), 404  # Return error if not found

DANGEROUSLY_LOW_THRESHOLDS = {
    "body_temperature": 36.5,
    "activity_level": 1000,
    "milk_production": 5.0,
    "body_condition_score": 1.5,
    "estrous_cycle": 10.0,
    "feed_intake": 10.0,
    "rumen_ph": 5.5
}

@app.route('/alert', methods=['GET'])
def alert():
    try:
        # Get the current time and time 30 minutes ago
        now = datetime.utcnow()
        thirty_minutes_ago = now - timedelta(minutes=30)

        # Query data from MongoDB for the last 30 minutes
        query = {"timestamp": {"$gte": thirty_minutes_ago}}
        data = list(cow_collection.find(query))

        alerts = []
        for record in data:
            parameter = record['parameter']
            value = record['value']
            slave_id = record['slave_id']

            # Check if the value is dangerously low
            if parameter in DANGEROUSLY_LOW_THRESHOLDS:
                if value < DANGEROUSLY_LOW_THRESHOLDS[parameter]:
                    alerts.append({"slave_id": slave_id, "parameter": parameter})

        # Return response based on alerts
        if alerts:
            return jsonify({"status": "alert", "alerts": alerts}), 200
        else:
            return jsonify({"status": "ok", "message": "No dangerously low parameters detected"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
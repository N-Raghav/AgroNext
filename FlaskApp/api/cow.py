from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from datetime import datetime

cow_data_bp = Blueprint('cow_data', __name__)

cow_data_collection = None

def init_cow_data_collection(collection):
    global cow_data_collection
    cow_data_collection = collection

@cow_data_bp.route('/cow_data/<slave_id>', methods=['GET'])
def get_cow_data(slave_id):
    """
    Get cow data for the given slave_id where each parameter has a timestamp and value.
    The response is structured as a dictionary where keys are parameter names.
    """
    # Fetch all the records for the given slave_id from the collection
    records = cow_data_collection.find({'slave_id': slave_id})
    
    # Data structure to store the cow's parameters
    cow_data = {}

    for record in records:
        parameter = record.get('parameter')
        timestamp = record.get('timestamp')
        value = record.get('value')

        # Convert timestamp to string if it's a datetime object
        timestamp_str = timestamp.isoformat() if isinstance(timestamp, datetime) else timestamp

        # Add timestamp and value to the corresponding parameter
        if parameter not in cow_data:
            cow_data[parameter] = []
        cow_data[parameter].append({
            'timestamp': timestamp_str,
            'value': value
        })
    
    if cow_data:
        return jsonify(cow_data), 200  # Return structured data if found
    else:
        return jsonify({'message': 'No data found for the given cow id'}), 404
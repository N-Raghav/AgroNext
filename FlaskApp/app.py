from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
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

# Create a Task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = {
        "assignedTo": data.get("assignedTo"),
        "associatedAnimal": data.get("associatedAnimal"),
        "description": data.get("description"),
        "dueDate": data.get("dueDate"),
        "endDate": data.get("endDate"),
        "endTime": data.get("endTime"),
        "id": data.get("id"),
        "importance": data.get("importance"),
        "isDone": data.get("isDone", False),
        "repeat": data.get("repeat"),
        "startDate": data.get("startDate"),
        "startTime": data.get("startTime"),
        "status": data.get("status", "To Do"),
        "title": data.get("title")
    }
    result = task_collection.insert_one(task)
    return jsonify({"message": "Task created successfully", "task_id": str(result.inserted_id)}), 201

# View All Tasks
@app.route('/tasks', methods=['GET'])
def view_all_tasks():
    tasks = task_collection.find()
    task_list = []
    for task in tasks:
        task["_id"] = str(task["_id"])
        task_list.append(task)
    return jsonify(task_list)

# View a single Task
@app.route('/tasks/<task_id>', methods=['GET'])
def view_task(task_id):
    task = task_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        return jsonify({"message": "Task not found"}), 404
    task["_id"] = str(task["_id"])
    return jsonify(task)

# View based on Filters
@app.route('/tasks/filter', methods=['GET'])
def filter_tasks():
    query = {}
    assigned_to = request.args.get('assignedTo')
    status = request.args.get('status')
    importance = request.args.get('importance')
    associated_animal = request.args.get('associatedAnimal')
    if assigned_to:
        query['assignedTo'] = assigned_to
    if status:
        query['status'] = status
    if importance:
        query['importance'] = importance
    if associated_animal:
        query['associatedAnimal'] = associated_animal
    tasks = task_collection.find(query)
    task_list = []
    for task in tasks:
        task["_id"] = str(task["_id"])
        task_list.append(task)
    if not task_list:
        return jsonify({"message": "No matching tasks found"}), 404
    return jsonify(task_list)

# Edit a Task
@app.route('/tasks/<task_id>', methods=['PUT'])
def edit_task(task_id):
    data = request.json
    updated_task = {
        "$set": {
            "assignedTo": data.get("assignedTo"),
            "associatedAnimal": data.get("associatedAnimal"),
            "description": data.get("description"),
            "dueDate": data.get("dueDate"),
            "endDate": data.get("endDate"),
            "endTime": data.get("endTime"),
            "id": data.get("id"),
            "importance": data.get("importance"),
            "isDone": data.get("isDone"),
            "repeat": data.get("repeat"),
            "startDate": data.get("startDate"),
            "startTime": data.get("startTime"),
            "status": data.get("status"),
            "title": data.get("title")
        }
    }
    result = task_collection.update_one({"_id": ObjectId(task_id)}, updated_task)
    if result.matched_count == 0:
        return jsonify({"message": "Task not found"}), 404
    return jsonify({"message": "Task updated successfully"})

# Delete a Task
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = task_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        return jsonify({"message": "Task not found"}), 404
    return jsonify({"message": "Task deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)

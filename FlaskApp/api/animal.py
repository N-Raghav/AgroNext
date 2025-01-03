from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

animal_bp = Blueprint('animal', __name__)

animal_collection = None

def init_animal_collection(collection):
    global animal_collection
    animal_collection = collection

# Create an Animal
@animal_bp.route('/animals', methods=['POST'])
def create_animal():
    data = request.json
    animal = {
        "name": data.get("name"),
        "animalType": data.get("animalType"),
        "breed": data.get("breed"),
        "sex": data.get("sex"),
        "internalId": data.get("internalId"),
        "status": data.get("status"),
        "coatColour": data.get("coatColour"),
        "height": data.get("height"),
        "weight": data.get("weight"),
        "retentionScore": data.get("retentionScore"),
        "neutered": data.get("neutered", False),
        "breedingStock": data.get("breedingStock", False),
        "birthDate": data.get("birthDate"),
        "birthWeight": data.get("birthWeight"),
        "ageToWean": data.get("ageToWean"),
        "dateWeaned": data.get("dateWeaned"),
    }
    result = animal_collection.insert_one(animal)
    return jsonify({"message": "Animal added successfully", "animal_id": str(result.inserted_id)}), 201

# View All Animals
@animal_bp.route('/animals', methods=['GET'])
def view_all_animals():
    animals = animal_collection.find()
    animal_list = []
    for animal in animals:
        animal["_id"] = str(animal["_id"])
        animal_list.append(animal)
    return jsonify(animal_list)

# View a single Animal
@animal_bp.route('/animals/<animal_id>', methods=['GET'])
def view_animal(animal_id):
    animal = animal_collection.find_one({"_id": ObjectId(animal_id)})
    if not animal:
        return jsonify({"message": "Animal not found"}), 404
    animal["_id"] = str(animal["_id"])
    return jsonify(animal)

# Filter Animals
@animal_bp.route('/animals/filter', methods=['GET'])
def filter_animals():
    query = {}
    
    # Adding filters
    name = request.args.get('name')
    animal_type = request.args.get('animalType')
    breed = request.args.get('breed')
    sex = request.args.get('sex')
    status = request.args.get('status')
    coat_colour = request.args.get('coatColour')
    min_height = request.args.get('minHeight')
    max_height = request.args.get('maxHeight')
    min_weight = request.args.get('minWeight')
    max_weight = request.args.get('maxWeight')
    min_retention_score = request.args.get('minRetentionScore')
    max_retention_score = request.args.get('maxRetentionScore')
    neutered = request.args.get('neutered')
    breeding_stock = request.args.get('breedingStock')
    birth_date = request.args.get('birthDate')

    # Exact match filters
    if name:
        query['name'] = name
    if animal_type:
        query['animalType'] = animal_type
    if breed:
        query['breed'] = breed
    if sex:
        query['sex'] = sex
    if status:
        query['status'] = status
    if coat_colour:
        query['coatColour'] = coat_colour
    if neutered:
        query['neutered'] = neutered.lower() == 'true'
    if breeding_stock:
        query['breedingStock'] = breeding_stock.lower() == 'true'
    if birth_date:
        query['birthDate'] = birth_date
    
    # Range filters
    if min_height or max_height:
        query['height'] = {}
        if min_height:
            query['height']['$gte'] = float(min_height)
        if max_height:
            query['height']['$lte'] = float(max_height)
    
    if min_weight or max_weight:
        query['weight'] = {}
        if min_weight:
            query['weight']['$gte'] = float(min_weight)
        if max_weight:
            query['weight']['$lte'] = float(max_weight)

    if min_retention_score or max_retention_score:
        query['retentionScore'] = {}
        if min_retention_score:
            query['retentionScore']['$gte'] = float(min_retention_score)
        if max_retention_score:
            query['retentionScore']['$lte'] = float(max_retention_score)
    
    # Fetch and format results
    animals = animal_collection.find(query)
    animal_list = []
    for animal in animals:
        animal["_id"] = str(animal["_id"])
        animal_list.append(animal)

    if not animal_list:
        return jsonify({"message": "No matching animals found"}), 404

    return jsonify(animal_list)

# Edit an Animal
@animal_bp.route('/animals/<animal_id>', methods=['PUT'])
def edit_animal(animal_id):
    data = request.json
    updated_animal = {
        "$set": {
            "name": data.get("name"),
            "animalType": data.get("animalType"),
            "breed": data.get("breed"),
            "sex": data.get("sex"),
            "internalId": data.get("internalId"),
            "status": data.get("status"),
            "coatColour": data.get("coatColour"),
            "height": data.get("height"),
            "weight": data.get("weight"),
            "retentionScore": data.get("retentionScore"),
            "neutered": data.get("neutered"),
            "breedingStock": data.get("breedingStock"),
            "birthDate": data.get("birthDate"),
            "birthWeight": data.get("birthWeight"),
            "ageToWean": data.get("ageToWean"),
            "dateWeaned": data.get("dateWeaned"),
        }
    }
    result = animal_collection.update_one({"_id": ObjectId(animal_id)}, updated_animal)
    if result.matched_count == 0:
        return jsonify({"message": "Animal not found"}), 404
    return jsonify({"message": "Animal updated successfully"})

# Delete an Animal
@animal_bp.route('/animals/<animal_id>', methods=['DELETE'])
def delete_animal(animal_id):
    result = animal_collection.delete_one({"_id": ObjectId(animal_id)})
    if result.deleted_count == 0:
        return jsonify({"message": "Animal not found"}), 404
    return jsonify({"message": "Animal deleted successfully"})

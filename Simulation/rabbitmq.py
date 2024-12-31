import pika
import pymongo
from datetime import datetime

mongo_uri = "mongodb+srv://username:Lewandowski9#@agronext.6tt8c.mongodb.net/?retryWrites=true&w=majority&appName=AgroNext"
mongo_db_name = "cow_monitoring"
mongo_collection_name = "cow_data"

rabbitmq_host = '127.0.0.1'  
username = 'guest'  
password = 'guest'  
port = 5672
QUEUE_NAME = "COW_MONITORING_DATA"


try:
    mongo_client = pymongo.MongoClient(mongo_uri)
    mongo_client.admin.command('ping')
    print("Pinged your MongoDB deployment. Successfully connected!")
    db = mongo_client[mongo_db_name]
    collection = db[mongo_collection_name]
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    exit(1)


def callback(ch, method, properties, body):
    print(f"[RabbitMQ] Received: {body}")
    try:
        data = body.decode('utf-8').split(",")
        
        timestamp = data[0]
        
        slave_id = data[1]
        body_temperature = float(data[2])
        activity_level = int(data[3])
        milk_production = float(data[4])
        body_condition_score = float(data[5])
        estrous_cycle = int(data[6])
        feed_intake = float(data[7])
        rumen_ph = float(data[8])
        
        
        record = {
            "timestamp": timestamp, 
            "slave_id": slave_id,
            "body_temperature": body_temperature,
            "activity_level": activity_level,
            "milk_production": milk_production,
            "body_condition_score": body_condition_score,
            "estrous_cycle": estrous_cycle,
            "feed_intake": feed_intake,
            "rumen_ph": rumen_ph
        }
        
        collection.insert_one(record)
        print(f"[MongoDB] Data inserted: {record}")
    except Exception as e:
        print(f"[Error] Failed to process message: {e}")

credentials = pika.PlainCredentials(username, password)
connection_params = pika.ConnectionParameters(host=rabbitmq_host, port=port, credentials=credentials)
connection = pika.BlockingConnection(connection_params)
channel = connection.channel()

channel.queue_declare(queue=QUEUE_NAME)
channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)

print("[RabbitMQ] Waiting for messages. To exit press CTRL+C")

try:
    channel.start_consuming()
except KeyboardInterrupt:
    print("[RabbitMQ] Stopped consuming.")
    channel.stop_consuming()

connection.close()

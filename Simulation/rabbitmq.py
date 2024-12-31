import pika
import pymongo
import json
from datetime import datetime

rabbitmq_host = '127.0.0.1'
username = 'guest'
password = 'guest'
port = 5672
QUEUE_NAME = "COW_MONITORING_DATA"

mongodb_uri = "mongodb+srv://username:Agronext4@agronext.6tt8c.mongodb.net/?retryWrites=true&w=majority&appName=AgroNext"
db_name = "CowMonitoring"
collection_name = "CowData"

def setup_mongodb_client():
    client = pymongo.MongoClient(mongodb_uri)
    db = client[db_name]
    collection = db[collection_name]
    return collection

def setup_rabbitmq_connection():
    credentials = pika.PlainCredentials(username, password)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, port=port, credentials=credentials))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME)
    return connection, channel

def rabbitmq_callback(ch, method, properties, body):
    try:
        collection = setup_mongodb_client()
        message = body.decode('utf-8')
        timestamp, slave_id, parameter, value = message.split(',')
        
        document = {
            "timestamp": datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S"),
            "slave_id": slave_id,
            "parameter": parameter,
            "value": float(value) if parameter in ["body_temperature", "milk_production", "body_condition_score", "feed_intake", "rumen_ph"] else int(value)
        }
        
    
        collection.insert_one(document)
        print(f"[MongoDB] Inserted document: {document}")
    except Exception as e:
        print(f"[Error] Failed to process message: {e}")

def start_consumer():
    connection, channel = setup_rabbitmq_connection()
    print("[RabbitMQ] Waiting for messages...")
    try:
        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=rabbitmq_callback, auto_ack=True)
        channel.start_consuming()
    except KeyboardInterrupt:
        print("[RabbitMQ] Consumer stopped.")
    finally:
        connection.close()

if __name__ == "__main__":
    start_consumer()

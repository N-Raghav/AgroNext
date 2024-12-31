import random
import time
import pika
import multiprocessing
from datetime import datetime, timedelta

rabbitmq_host = '127.0.0.1'
username = 'guest'
password = 'guest'
port = 5672
ssl = False
QUEUE_NAME = "COW_MONITORING_DATA"

last_update = {
    "body_temperature": datetime.min,
    "activity_level": datetime.min,
    "milk_production": datetime.min,
    "body_condition_score": datetime.min,
    "estrous_cycle": datetime.min,
    "feed_intake": datetime.min,
    "rumen_ph": datetime.min
}

update_frequency = {
    "body_temperature": timedelta(minutes=15),
    "activity_level": timedelta(minutes=10),
    "milk_production": timedelta(hours=12),
    "body_condition_score": timedelta(days=7),
    "estrous_cycle": timedelta(days=1),
    "feed_intake": timedelta(hours=1),
    "rumen_ph": timedelta(minutes=30)
}

def setup_rabbitmq_channel():
    credentials = pika.PlainCredentials(username, password)
    parameters = pika.ConnectionParameters(host=rabbitmq_host, port=port, credentials=credentials, heartbeat=60)
    
    while True:
        try:
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME)
            print("[RabbitMQ] Connection established.")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            print(f"[RabbitMQ] Connection error: {e}. Retrying in 5 seconds...")
            time.sleep(5)
        except Exception as e:
            print(f"[RabbitMQ] Unexpected error: {e}. Retrying in 5 seconds...")
            time.sleep(5)

def generate_body_temperature():
    return round(random.uniform(36.0, 40.0), 1)

def generate_activity_level():
    return random.randint(5000, 15000)

def generate_milk_production():
    return round(random.uniform(20.0, 50.0), 1)

def generate_body_condition_score():
    return round(random.uniform(2.5, 4.5), 1)

def generate_estrous_cycle():
    return random.randint(18, 25)

def generate_feed_intake():
    return round(random.uniform(10.0, 30.0), 1)

def generate_rumen_ph():
    return round(random.uniform(5.8, 7.2), 1)

def should_update(parameter, current_time):
    return (current_time - last_update[parameter]) >= update_frequency[parameter]

def parameter_worker(slave_id):
    while True:
        try:
            connection, channel = setup_rabbitmq_channel()
            while True:
                current_time = datetime.now()
                for parameter, generator in [
                    ("body_temperature", generate_body_temperature),
                    ("activity_level", generate_activity_level),
                    ("milk_production", generate_milk_production),
                    ("body_condition_score", generate_body_condition_score),
                    ("estrous_cycle", generate_estrous_cycle),
                    ("feed_intake", generate_feed_intake),
                    ("rumen_ph", generate_rumen_ph),
                ]:
                    if should_update(parameter, current_time):
                        value = generator()
                        last_update[parameter] = current_time
                        data = {
                            "timestamp": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                            "slave_id": slave_id,
                            "parameter": parameter,
                            "value": value
                        }
                        message = f"{data['timestamp']},{data['slave_id']},{data['parameter']},{data['value']}"
                        try:
                            channel.basic_publish(exchange='', routing_key=QUEUE_NAME, body=message)
                            print(f"[{parameter}] Sent to RabbitMQ: {message}")
                        except pika.exceptions.AMQPConnectionError as e:
                            print(f"[Worker] Connection error during message publish: {e}. Reconnecting...")
                            break  
                time.sleep(1)  
        except (pika.exceptions.AMQPConnectionError, Exception) as e:
            print(f"[Worker] Lost connection or error: {e}. Reconnecting...")
            time.sleep(5)  
        finally:
            try:
                if connection and connection.is_open:
                    connection.close()
                    print(f"[Worker] Connection closed for {slave_id}.")
            except Exception as e:
                print(f"[Worker] Error closing connection for {slave_id}: {e}")

def main():
    print("[Simulation] Starting...")
    n_slaves = int(input("Enter the number of slave nodes: "))
    processes = []

    for i in range(n_slaves):
        slave_id = f"Cow-{i+1}"
        process = multiprocessing.Process(target=parameter_worker, args=(slave_id,))
        processes.append(process)
        process.start()

    try:
        for process in processes:
            process.join()
    except KeyboardInterrupt:
        print("[Simulation] Terminating...")
        for process in processes:
            process.terminate()
    print("[Simulation] Stopped.")

if __name__ == "__main__":
    main()

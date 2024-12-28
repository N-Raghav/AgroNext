import random
import time
import pika
import multiprocessing
from datetime import datetime

rabbitmq_host = '127.0.0.1'
username = 'guest'
password = 'guest'
port = 5672
ssl = False
QUEUE_NAME = "COW_MONITORING_DATA"

def generate_cow_parameters():
    data = {
        "body_temperature": round(random.uniform(36.0, 40.0), 1),
        "activity_level": random.randint(5000, 15000),
        "milk_production": round(random.uniform(20.0, 50.0), 1),
        "body_condition_score": round(random.uniform(2.5, 4.5), 1),
        "estrous_cycle": random.randint(18, 25),
        "feed_intake": round(random.uniform(10.0, 30.0), 1),
        "rumen_ph": round(random.uniform(5.8, 7.2), 1)
    }
    return data

def slave_node(slave_id):
    while True:
        cow_data = generate_cow_parameters()
        cow_data["slave_id"] = slave_id
        cow_data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  
        line = f"{cow_data['timestamp']},{slave_id},{cow_data['body_temperature']},{cow_data['activity_level']},{cow_data['milk_production']},{cow_data['body_condition_score']},{cow_data['estrous_cycle']},{cow_data['feed_intake']},{cow_data['rumen_ph']}"
        send_to_rabbitmq(line)
        time.sleep(4)

def send_to_rabbitmq(data):
    credentials = pika.PlainCredentials(username, password)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, port=port, credentials=credentials))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE_NAME)
    channel.basic_publish(exchange='', routing_key=QUEUE_NAME, body=data)
    print(f"[Gateway] Sent to RabbitMQ: {data}")
    connection.close()

def main():
    n_slaves = int(input("Enter the number of slave nodes: "))

    processes = []
    for i in range(n_slaves):
        slave_id = f"Cow-{i+1}"
        process = multiprocessing.Process(target=slave_node, args=(slave_id,))
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

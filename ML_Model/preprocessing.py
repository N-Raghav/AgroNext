import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
import pymongo
from dotenv import load_dotenv

mongo_uri = os.getenv("MONGO_URI")
mongo_client = pymongo.MongoClient(mongo_uri)

db_cow_monitoring = mongo_client["cow_monitoring"]
collection_cow_data = db_cow_monitoring["CowData"]

cow_data = pd.DataFrame(list(collection_cow_data.find()))

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

columns = ['timestamp', 'slave_id', 'body_temperature', 'activity_level', 'milk_production', 'body_condition_score', 'estrous_cycle', 'feed_intake', 'rumen_ph']
df = pd.DataFrame(columns=columns)
for i in cow_data_dict:
    new_record = create_record_from_data(cow_data_dict[i])
    new_record['slave_id'] = i
    df = pd.concat([df, new_record], ignore_index=True)
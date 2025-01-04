import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import LSTM, Dense, Dropout, Concatenate, Input # type: ignore
from tensorflow.keras.models import Model # type: ignore
import pymongo

mongo_uri = "mongodb+srv://username:Agronext4@agronext.6tt8c.mongodb.net/?retryWrites=true&w=majority&appName=AgroNext"
mongo_client = pymongo.MongoClient(mongo_uri)

db_cow_monitoring = mongo_client["cow_monitoring"]
collection_cow_data = db_cow_monitoring["cow_data"]

db_cycle_history = mongo_client["cow_monitoring"]
collection_cycle_history = db_cycle_history["cycle_data"]

db_predicted_schedule = mongo_client["cow_monitoring"]
collection_predictions = db_predicted_schedule["predicted_cycle"]

class CowInseminationPredictor:
    def __init__(self, sequence_length=30, prediction_days=7, cycle_history_length=5):
        self.sequence_length = sequence_length
        self.prediction_days = prediction_days
        self.cycle_history_length = cycle_history_length
        self.scaler = MinMaxScaler()
        self.cycle_scaler = MinMaxScaler()
        self.model = self._build_lstm_model()
    
    def _build_lstm_model(self):
        sequence_input = Input(shape=(self.sequence_length, 9))
        x1 = LSTM(64, return_sequences=True)(sequence_input)
        x1 = Dropout(0.2)(x1)
        x1 = LSTM(32)(x1)
        x1 = Dropout(0.2)(x1)
        
        cycle_input = Input(shape=(self.cycle_history_length,))
        x2 = Dense(16, activation='relu')(cycle_input)
        
        combined = Concatenate()([x1, x2])
        x = Dense(16, activation='relu')(combined)
        output = Dense(1)(x)
        
        model = Model(inputs=[sequence_input, cycle_input], outputs=output)
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def prepare_sequences(self, cow_data):
        """Prepare sequences for LSTM with cycle history."""
        features, cycle_histories, targets = [], [], []
        
        for cow_id, data in cow_data.groupby('slave_id'):
            data = data.sort_values('timestamp').set_index('timestamp')
            cycle_data = collection_cycle_history.find_one({"cow_id": cow_id})
            if cycle_data:
                cycle_lengths = cycle_data.get("cycle_lengths", [21] * self.cycle_history_length)
            else:
                cycle_lengths = [21] * self.cycle_history_length
            
            feature_matrix = np.column_stack((
                data['body_temperature'].values,
                data['activity_level'].values,
                data['milk_production'].values,
                data['body_condition_score'].values,
                data['estrous_cycle'].values,
                data['feed_intake'].values,
                data['rumen_ph'].values,
                self._calculate_activity_momentum(data['activity_level'].values),
                self._calculate_temp_variation(data['body_temperature'].values)
            ))
            
            scaled_features = self.scaler.fit_transform(feature_matrix)
            scaled_cycles = self.cycle_scaler.fit_transform(np.array(cycle_lengths).reshape(-1, 1))
            
            for i in range(len(scaled_features) - self.sequence_length):
                features.append(scaled_features[i:(i + self.sequence_length)])
                cycle_histories.append(scaled_cycles.flatten())
                targets.append(self._find_next_peak(data.iloc[i + self.sequence_length:]))
        
        return [np.array(features), np.array(cycle_histories)], np.array(targets)
    
    def predict_next_date(self, current_data, cow_id):
        """Predict the next insemination date."""
        feature_matrix = np.column_stack((
            current_data['body_temperature'].values[-self.sequence_length:],
            current_data['activity_level'].values[-self.sequence_length:],
            current_data['milk_production'].values[-self.sequence_length:],
            current_data['body_condition_score'].values[-self.sequence_length:],
            current_data['estrous_cycle'].values[-self.sequence_length:],
            current_data['feed_intake'].values[-self.sequence_length:],
            current_data['rumen_ph'].values[-self.sequence_length:],
            self._calculate_activity_momentum(current_data['activity_level'].values[-self.sequence_length:]),
            self._calculate_temp_variation(current_data['body_temperature'].values[-self.sequence_length:])
        ))
        
        # Fetch cycle history for the cow
        cycle_data = collection_cycle_history.find_one({"cow_id": cow_id})
        cycle_lengths = cycle_data.get("cycle_lengths", [21] * self.cycle_history_length) if cycle_data else [21] * self.cycle_history_length
        
        scaled_features = self.scaler.transform(feature_matrix)
        scaled_cycles = self.cycle_scaler.transform(np.array(cycle_lengths).reshape(-1, 1))
        
        prediction = self.model.predict([
            scaled_features.reshape(1, self.sequence_length, 9),
            scaled_cycles.reshape(1, self.cycle_history_length)
        ])
        
        predicted_days = int(round(prediction[0][0]))
        avg_cycle_length = np.mean(cycle_lengths)
        if abs(predicted_days - avg_cycle_length) > 5:
            predicted_days = int(round(0.7 * predicted_days + 0.3 * avg_cycle_length))
        
        current_date = datetime.strptime(current_data['timestamp'].iloc[-1], '%Y-%m-%d %H:%M:%S')
        return current_date + timedelta(days=predicted_days)
    
    def generate_alerts(self, predictions):
        """Store predictions and generate alerts."""
        alerts = []
        for cow_id, predicted_date in predictions.items():
            days_until = (predicted_date - datetime.now()).days
            alert = {
                'cow_id': cow_id,
                'predicted_date': predicted_date.strftime('%Y-%m-%d'),
                'days_until': days_until
            }
            alerts.append(alert)
            
            # Save predictions to the database
            collection_predictions.update_one(
                {"cow_id": cow_id},
                {"$set": {"predicted_date": predicted_date}},
                upsert=True
            )
        return alerts
    
    def _calculate_activity_momentum(self, activity_values):
        return np.gradient(activity_values)
    
    def _calculate_temp_variation(self, temp_values):
        return np.abs(np.gradient(temp_values))
    
    def _find_next_peak(self, future_data, lookahead=21):
        future_data = future_data.iloc[:lookahead]
        rolling_mean = future_data['activity_level'].rolling(3).mean()
        for i in range(1, len(rolling_mean)-1):
            if rolling_mean.iloc[i] > rolling_mean.iloc[i-1] and rolling_mean.iloc[i] > rolling_mean.iloc[i+1]:
                return i
        return None

if __name__ == "__main__":
    predictor = CowInseminationPredictor()
    cow_data = pd.DataFrame(list(collection_cow_data.find()))
    [features, cycle_histories], targets = predictor.prepare_sequences(cow_data)
    predictor.train([features, cycle_histories], targets)
    
    predictions = {}
    for cow_id in cow_data['slave_id'].unique():
        recent_data = pd.DataFrame(
            list(collection_cow_data.find({"slave_id": cow_id}).sort("timestamp", -1).limit(predictor.sequence_length))
        )
        if len(recent_data) >= predictor.sequence_length:
            predictions[cow_id] = predictor.predict_next_date(recent_data, cow_id)
    
    alerts = predictor.generate_alerts(predictions)
    print("Alerts:", alerts)

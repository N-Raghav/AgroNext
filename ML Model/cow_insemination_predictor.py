import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Concatenate, Input
from tensorflow.keras.models import Model
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pymongo

mongo_uri = "mongodb+srv://username:password@agronext.6tt8c.mongodb.net/?retryWrites=true&w=majority&appName=AgroNext"
mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["cow_monitoring"]
collection = db["cow_data"]

class CowInseminationPredictor:
    def __init__(self, sequence_length=30, prediction_days=7, cycle_history_length=5):
        self.sequence_length = sequence_length
        self.prediction_days = prediction_days
        self.cycle_history_length = cycle_history_length
        self.scaler = MinMaxScaler()
        self.cycle_scaler = MinMaxScaler()
        self.model = self._build_lstm_model()
        self.email_config = {
            'smtp_server': 'smtp.gmail.com',
            'smtp_port': 587,
            'sender_email': 'your-email@gmail.com',
            'sender_password': 'your-app-specific-password',
            'recipient_emails': ['farm-manager@example.com', 'vet@example.com']
        }
    
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
    
    def _extract_cycle_lengths(self, data):
        """Extract historical cycle lengths for a cow"""
        cycles = []
        peaks = []
        
        activity_series = data['activity_level']
        rolling_mean = activity_series.rolling(3).mean()
        
        for i in range(1, len(rolling_mean)-1):
            if rolling_mean.iloc[i] > rolling_mean.iloc[i-1] and \
               rolling_mean.iloc[i] > rolling_mean.iloc[i+1] and \
               rolling_mean.iloc[i] > rolling_mean.mean() + rolling_mean.std():
                peaks.append(data.index[i])
        
        for i in range(1, len(peaks)):
            cycle_length = (peaks[i] - peaks[i-1]).days
            if 18 <= cycle_length <= 24:  # Valid cycle length range
                cycles.append(cycle_length)
        
        return cycles[-self.cycle_history_length:] if cycles else [21] * self.cycle_history_length  
    
    def prepare_sequences(self, data):
        """Prepare sequences for LSTM with cycle history"""
        features = []
        cycle_histories = []
        targets = []
        
        for cow_id, cow_data in data.groupby('slave_id'):
            cow_data = cow_data.sort_values('timestamp').set_index('timestamp')
            
            cycle_lengths = self._extract_cycle_lengths(cow_data)
            
            feature_matrix = np.column_stack((
                cow_data['body_temperature'].values,
                cow_data['activity_level'].values,
                cow_data['milk_production'].values,
                cow_data['body_condition_score'].values,
                cow_data['estrous_cycle'].values,
                cow_data['feed_intake'].values,
                cow_data['rumen_ph'].values,
                self._calculate_activity_momentum(cow_data['activity_level'].values),
                self._calculate_temp_variation(cow_data['body_temperature'].values)
            ))
            
            scaled_features = self.scaler.fit_transform(feature_matrix)
            scaled_cycles = self.cycle_scaler.fit_transform(np.array(cycle_lengths).reshape(-1, 1))
            
            for i in range(len(scaled_features) - self.sequence_length):
                features.append(scaled_features[i:(i + self.sequence_length)])
                cycle_histories.append(scaled_cycles.flatten())
                
                next_peak = self._find_next_peak(cow_data.iloc[i + self.sequence_length:])
                if next_peak is not None:
                    targets.append(next_peak)
        
        return [np.array(features), np.array(cycle_histories)], np.array(targets)
    
    def predict_next_date(self, current_data):
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
        
        current_data_df = current_data.copy()
        current_data_df['timestamp'] = pd.to_datetime(current_data_df['timestamp'])
        current_data_df = current_data_df.set_index('timestamp')
        cycle_lengths = self._extract_cycle_lengths(current_data_df)
        
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

    def prepare_sequences(self, data):
        features = []
        targets = []
        
        # Group data by cow
        for cow_id, cow_data in data.groupby('slave_id'):
            cow_data = cow_data.sort_values('timestamp')
            
            # Create feature matrix
            feature_matrix = np.column_stack((
                cow_data['body_temperature'].values,
                cow_data['activity_level'].values,
                cow_data['milk_production'].values,
                cow_data['body_condition_score'].values,
                cow_data['estrous_cycle'].values,
                cow_data['feed_intake'].values,
                cow_data['rumen_ph'].values,
                self._calculate_activity_momentum(cow_data['activity_level'].values),
                self._calculate_temp_variation(cow_data['body_temperature'].values)
            ))
            
            # Scale features
            scaled_features = self.scaler.fit_transform(feature_matrix)
            
            # Create sequences
            for i in range(len(scaled_features) - self.sequence_length):
                features.append(scaled_features[i:(i + self.sequence_length)])
                next_peak = self._find_next_peak(cow_data.iloc[i + self.sequence_length:])
                if next_peak is not None:
                    targets.append(next_peak)
                    
        return np.array(features), np.array(targets)
    
    def _calculate_activity_momentum(self, activity_values):
        return np.gradient(activity_values)
    
    def _calculate_temp_variation(self, temp_values):
        return np.abs(np.gradient(temp_values))
    
    def _find_next_peak(self, future_data, lookahead=21):
        if len(future_data) == 0:
            return None
            
        future_data = future_data.iloc[:lookahead] if len(future_data) > lookahead else future_data
        activity_series = future_data['activity_level']
        
        if len(activity_series) < 3:
            return None
            
        rolling_mean = activity_series.rolling(3).mean()
        
        for i in range(1, len(rolling_mean)-1):
            if rolling_mean.iloc[i] > rolling_mean.iloc[i-1] and \
               rolling_mean.iloc[i] > rolling_mean.iloc[i+1] and \
               rolling_mean.iloc[i] > rolling_mean.mean() + rolling_mean.std():
                return i
                
        return None
    
    def train(self, features, targets, epochs=50, batch_size=32):
        self.model.fit(
            features, targets,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=1
        )
    
    def generate_alerts(self, all_predictions):
        alerts = []
        current_date = datetime.now()
        
        for cow_id, predicted_date in all_predictions.items():
            days_until = (predicted_date - current_date).days
            
            if days_until <= self.prediction_days:
                alert_level = self._determine_alert_level(days_until)
                alert = {
                    'cow_id': cow_id,
                    'predicted_date': predicted_date,
                    'days_until': days_until,
                    'alert_level': alert_level
                }
                alerts.append(alert)
                self._send_alert_email(alert)
        
        return alerts
    
    def _determine_alert_level(self, days_until):
        if days_until <= 1:
            return 'CRITICAL'
        elif days_until <= 3:
            return 'HIGH'
        elif days_until <= 5:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def _send_alert_email(self, alert):
        subject = f"Cow Insemination Alert - {alert['alert_level']} - {alert['cow_id']}"
        
        body = f"""
        Insemination Alert for {alert['cow_id']}
        
        Alert Level: {alert['alert_level']}
        Predicted Insemination Date: {alert['predicted_date'].strftime('%Y-%m-%d')}
        Days Until Insemination: {alert['days_until']}
        
        Please prepare necessary arrangements for insemination.
        
        This is an automated message from the Cow Monitoring System.
        """
        
        msg = MIMEMultipart()
        msg['From'] = self.email_config['sender_email']
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        try:
            server = smtplib.SMTP(self.email_config['smtp_server'], self.email_config['smtp_port'])
            server.starttls()
            server.login(self.email_config['sender_email'], self.email_config['sender_password'])
            
            for recipient in self.email_config['recipient_emails']:
                msg['To'] = recipient
                server.send_message(msg)
            
            server.quit()
            print(f"Alert email sent successfully for {alert['cow_id']}")
        except Exception as e:
            print(f"Failed to send alert email: {e}")

if __name__ == "__main__":
    predictor = CowInseminationPredictor(cycle_history_length=5)
    
    historical_data = pd.DataFrame(list(collection.find()))
    
    [features, cycle_histories], targets = predictor.prepare_sequences(historical_data)
    predictor.train([features, cycle_histories], targets)
    
    all_predictions = {}
    
    for cow_id in historical_data['slave_id'].unique():
        recent_data = pd.DataFrame(
            list(collection.find({"slave_id": cow_id})
            .sort("timestamp", -1)
            .limit(predictor.sequence_length))
        )
        
        if len(recent_data) >= predictor.sequence_length:
            next_date = predictor.predict_next_date(recent_data)
            all_predictions[cow_id] = next_date
    
    alerts = predictor.generate_alerts(all_predictions)

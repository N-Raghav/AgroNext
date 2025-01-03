import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from cow_insemination_predictor import CowInseminationPredictor

def generate_mock_data(num_cows=5, days=90):
    """Generate realistic mock data for cow monitoring"""
    data = []
    start_date = datetime.now() - timedelta(days=days)
    
    for cow_id in range(1, num_cows + 1):
        cycle_length = 21
        cycle_position = np.random.randint(0, cycle_length)
        
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            cycle_position = (cycle_position + 1) % cycle_length
            
            base_temp = 38.5 
            base_activity = 100 
            base_milk = 25 
            
            cycle_factor = np.sin(2 * np.pi * cycle_position / cycle_length)
            
            temp_noise = np.random.normal(0, 0.2)
            activity_noise = np.random.normal(0, 10)
            milk_noise = np.random.normal(0, 2)
            
            body_temp = base_temp + 0.3 * cycle_factor + temp_noise
            activity = base_activity + 50 * cycle_factor + activity_noise
            milk_prod = base_milk + 3 * cycle_factor + milk_noise
            
            if cycle_position in [19, 20, 0]:
                body_temp += 0.3
                activity *= 1.5
            
            data.append({
                'slave_id': f'COW_{cow_id:03d}',
                'timestamp': current_date.strftime('%Y-%m-%d %H:%M:%S'),
                'body_temperature': round(body_temp, 2),
                'activity_level': max(0, round(activity, 2)),
                'milk_production': max(0, round(milk_prod, 2)),
                'body_condition_score': round(np.random.uniform(2.5, 4.5), 1),
                'estrous_cycle': cycle_position,
                'feed_intake': round(np.random.normal(20, 2), 2),
                'rumen_ph': round(np.random.uniform(6.2, 6.8), 2)
            })
    
    return pd.DataFrame(data)

def test_predictor():
    print("Generating mock data...")
    mock_data = generate_mock_data()
    
    print("\nInitializing predictor...")
    predictor = CowInseminationPredictor()
    
    print("\nPreparing sequences and training model...")
    features, targets = predictor.prepare_sequences(mock_data)
    
    print("\nTraining model...")
    predictor.train(features, targets, epochs=10)
    
    print("\nTesting predictions...")
    all_predictions = {}
    
    for cow_id in mock_data['slave_id'].unique():
        recent_data = mock_data[mock_data['slave_id'] == cow_id].tail(predictor.sequence_length)
        
        if len(recent_data) >= predictor.sequence_length:
            next_date = predictor.predict_next_date(recent_data)
            all_predictions[cow_id] = next_date
            print(f"\nPredictions for {cow_id}:")
            print(f"Next predicted insemination date: {next_date}")
    
    print("\nGenerating alerts...")
    alerts = predictor.generate_alerts(all_predictions)
    
    if alerts:
        print("\nAlerts generated:")
        for alert in alerts:
            print(f"\nCow ID: {alert['cow_id']}")
            print(f"Alert Level: {alert['alert_level']}")
            print(f"Predicted Date: {alert['predicted_date']}")
            print(f"Days Until: {alert['days_until']}")
    else:
        print("\nNo immediate alerts generated")

if __name__ == "__main__":
    test_predictor()
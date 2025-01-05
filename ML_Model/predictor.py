import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam

# Step 1: Simulated Data Creation (Replace with Real Data)
# Columns: ['Body Temperature', 'Activity Level', 'Rumen pH', 'Milk Production', 'Feed Intake', 'Body Condition Score', 'Previous Estrus Heat Date', 'Estrus Heat Date']
data_size = 1000
np.random.seed(42)
previous_estrus_date = 21  # Initial default value for all data
data = {
    'Body Temperature': np.random.normal(38.5, 0.5, data_size),
    'Activity Level': np.random.normal(50, 10, data_size),
    'Rumen pH': np.random.normal(6.5, 0.2, data_size),
    'Milk Production': np.random.normal(20, 5, data_size),
    'Feed Intake': np.random.normal(25, 2, data_size),
    'Body Condition Score': np.random.normal(3.5, 0.5, data_size),
    'Previous Estrus Heat Date': np.full(data_size, previous_estrus_date),
    'Estrus Heat Date': np.random.uniform(19, 23, data_size)  # Target variable
}

df = pd.DataFrame(data)

# Step 2: Data Preprocessing
X = df.drop(columns=['Estrus Heat Date'])
y = df['Estrus Heat Date']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Step 3: Build the Neural Network Model
model = Sequential([
    Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(1)  # Single output for the predicted date
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error', metrics=['mae'])

# Step 4: Train the Model (Increased training epochs)
history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=200, batch_size=32, verbose=1)

# Step 5: Evaluate the Model
eval_results = model.evaluate(X_test, y_test, verbose=1)
print("\nTest Loss (MSE):", eval_results[0])
print("Test MAE:", eval_results[1])

# Step 6: Save the Model and Scaler
with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

model.save("estrus_heat_prediction_model.h5")

# Step 7: Make Predictions and Save Input Code
predictions = model.predict(X_test)

# Display first 10 predictions vs actual values
print("\nPredicted Estrus Heat Dates:", predictions[:10].flatten())
print("Actual Estrus Heat Dates:", y_test[:10].values)

# Save the code to make predictions using the trained model
def predict_estrus_heat(input_data):
    """Predict estrus heat date given input features."""
    with open('scaler.pkl', 'rb') as scaler_file:
        loaded_scaler = pickle.load(scaler_file)

    from tensorflow.keras.models import load_model
    loaded_model = load_model("estrus_heat_prediction_model.h5")

    # Ensure input_data is a 2D array
    input_data = np.array(input_data).reshape(1, -1)
    scaled_data = loaded_scaler.transform(input_data)
    prediction = loaded_model.predict(scaled_data)
    return prediction.flatten()[0]

# Example Input and Prediction
example_input = [38.7, 55, 6.6, 18, 24, 3.8, 21]  # Example features with Previous Estrus Heat Date
predicted_date = predict_estrus_heat(example_input)
print("\nExample Prediction:", predicted_date)

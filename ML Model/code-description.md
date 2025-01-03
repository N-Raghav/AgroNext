# Cow Insemination Prediction System

## Overview
This system predicts optimal insemination dates for dairy cows using machine learning and real-time monitoring data. It combines LSTM neural networks with historical cycle analysis to make accurate predictions.

## Technical Stack
- **Programming Language**: Python 3.x
- **Deep Learning Framework**: TensorFlow 2.x
- **Database**: MongoDB
- **Key Libraries**: 
  - pandas (data manipulation)
  - numpy (numerical operations)
  - scikit-learn (data preprocessing)
  - tensorflow.keras (deep learning)
  - pymongo (database connectivity)

## Core Components

### 1. Neural Network Architecture
- Dual-input LSTM model
- Input streams:
  - Time-series physiological data (30-day sequences)
  - Historical cycle patterns (5 previous cycles)
- Architecture:
  - 2 LSTM layers (64 and 32 units)
  - Dropout layers (0.2 rate)
  - Dense layers for feature combination
  - Single output node for days prediction

### 2. Feature Engineering
- 9 primary features including:
  - Physiological measurements (temperature, activity, etc.)
  - Derived metrics (activity momentum, temperature variation)
  - Historical cycle lengths
- All features normalized using MinMaxScaler

### 3. Data Processing
- Sequence length: 30 days
- Cycle history length: 5 cycles
- Rolling window approach for time series
- Peak detection for cycle identification
- Adaptive prediction weighting based on historical patterns

### 4. Alert System
- Multi-level alerting (Critical, High, Medium, Low)
- Email notification system
- Configurable prediction window (default 7 days)
- Integration with MongoDB for real-time monitoring

## Main Functionality
1. Processes real-time cow monitoring data
2. Analyzes historical estrous cycles
3. Predicts next optimal insemination date
4. Generates timely alerts for farm management
5. Maintains historical records in MongoDB

## Performance Features
- Handles missing data
- Accounts for irregular cycles
- Combines model predictions with historical patterns
- Real-time processing capability
- Scalable to multiple animals

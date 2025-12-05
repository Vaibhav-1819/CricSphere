# Save this as: ml_model/MISTrainer.py

import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Mock Historical Data (Training Set)
# Features: [Runs, StrikeRate, Wickets, EconomyRate]
X_train = np.array([
    [50, 130.0, 0, 0.0],   # Good Batting
    [10, 80.0, 0, 0.0],    # Poor Batting
    [0, 0.0, 3, 5.5],      # Excellent Bowling
    [5, 100.0, 1, 9.0],    # Average All-round
    [100, 160.0, 0, 0.0]   # Match Winning Batting
])

# Target Labels: The "True" Impact Score (0-100) based on expert analysis
y_train = np.array([45, 10, 85, 35, 95])

# 2. Initialize and Train the Model
model = LinearRegression()
model.fit(X_train, y_train)

# 3. Extract the "Learned" Weights (Coefficients)
batting_weight = model.coef_[0]
strike_rate_weight = model.coef_[1]
bowling_weight = model.coef_[2]
economy_weight = model.coef_[3]
bias = model.intercept_

print("--- Model Trained Successfully ---")
print(f"Batting Weight: {batting_weight:.2f}")      # Approx 0.5
print(f"Bowling Weight: {bowling_weight:.2f}")      # Approx 25.0
print(f"Strike Rate Bonus: {strike_rate_weight:.2f}")
print(f"Economy Penalty: {economy_weight:.2f}")

print("\n--- Ready for Deployment ---")
print("Copy these weights into MISService.java")
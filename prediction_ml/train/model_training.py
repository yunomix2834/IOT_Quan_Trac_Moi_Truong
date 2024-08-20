from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.preprocessing import StandardScaler
from train.config import pipeline, param_grid
import numpy as np

def train_model(X, y, param_grid):
    # Xử lý NaN trong y bằng cách loại bỏ các hàng chứa NaN
    if y.isna().any():
        non_nan_indices = ~y.isna()
        X = X[non_nan_indices]
        y = y[non_nan_indices]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, cv=3, n_jobs=-1, scoring='r2')
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_

    return best_model, X_test, y_test

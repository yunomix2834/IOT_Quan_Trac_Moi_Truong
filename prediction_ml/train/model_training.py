from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from train.config import pipeline, param_grid
import numpy as np

def train_model(X, y, param_grid):
    # Xử lý NaN trong y bằng cách loại bỏ các hàng chứa NaN
    if y.isna().any():
        non_nan_indices = ~y.isna()
        X = X[non_nan_indices]
        y = y[non_nan_indices]

    # Sử dụng cross-validation với GridSearchCV
    grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, cv=5, n_jobs=-1, scoring='r2')
    grid_search.fit(X, y)

    best_model = grid_search.best_estimator_

    return best_model

from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, FunctionTransformer, PolynomialFeatures
from sklearn.impute import SimpleImputer
import pandas as pd
import numpy as np

def custom_interpolation(X):
    if not isinstance(X, pd.DataFrame):
        X = pd.DataFrame(X)
    X.replace([np.inf, -np.inf], np.nan, inplace=True)
    if 'DustDensity' in X.columns:
        X['DustDensity'] = X['DustDensity'].interpolate(method='linear')
        X['DustDensity'] = X['DustDensity'].bfill().ffill()
    return X

pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('interpolator', FunctionTransformer(custom_interpolation, validate=False)),
    ('scaler', StandardScaler()),
    ('poly', PolynomialFeatures(degree=2, include_bias=False)),
    ('model', RandomForestRegressor(random_state=42))
])

param_grid = [
    {
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [None, 10, 20, 30],
        'model__min_samples_split': [2, 5, 10],
        'model__min_samples_leaf': [1, 2, 4],
        'model__bootstrap': [True, False]
    }
]

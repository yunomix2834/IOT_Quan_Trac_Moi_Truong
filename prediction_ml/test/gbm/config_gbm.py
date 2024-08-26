from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, FunctionTransformer, PolynomialFeatures
from sklearn.ensemble import GradientBoostingRegressor
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
    ('model', GradientBoostingRegressor(random_state=42))
])

param_grid = [
    {  # Param cho GradientBoostingRegressor
        'model': [GradientBoostingRegressor(random_state=42)],
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [3, 5, 7],
        'model__learning_rate': [0.01, 0.1, 0.2],
        'model__subsample': [0.8, 1.0]
    },
]

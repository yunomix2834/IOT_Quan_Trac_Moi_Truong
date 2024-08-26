from sklearn.pipeline import Pipeline
from sklearn.svm import SVR
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
    ('model', SVR())
])

param_grid = [
    {
        'model__kernel': ['linear', 'rbf'],
        'model__C': [0.1, 1, 10],
        'model__gamma': ['scale', 'auto']
    },
]

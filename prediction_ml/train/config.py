from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import StandardScaler, FunctionTransformer, PolynomialFeatures
from sklearn.impute import SimpleImputer
import xgboost as xgb
import pandas as pd
import numpy as np

def custom_interpolation(X):
    # Đảm bảo X là một DataFrame
    if not isinstance(X, pd.DataFrame):
        X = pd.DataFrame(X)

    # Kiểm tra và loại bỏ các giá trị không hợp lệ trước khi nội suy
    X.replace([np.inf, -np.inf], np.nan, inplace=True)

    if 'DustDensity' in X.columns:
        X['DustDensity'] = X['DustDensity'].interpolate(method='linear')
        X['DustDensity'] = X['DustDensity'].bfill().ffill()

    return X

# Tạo Pipeline với tiền xử lý và mô hình
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),  # Điền giá trị thiếu bằng giá trị trung bình
    ('interpolator', FunctionTransformer(custom_interpolation, validate=False)),
    ('scaler', StandardScaler()),  # Chuẩn hóa dữ liệu
    ('poly', PolynomialFeatures(degree=2, include_bias=False)),  # Tạo các đặc trưng bậc cao
    ('model', RandomForestRegressor(random_state=42))  # Model mặc định ban đầu
])

# Param_grid cho GridSearchCV
param_grid = [
    {  # Param cho RandomForestRegressor
        'model': [RandomForestRegressor(random_state=42)],
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [None, 10, 20, 30],
        'model__min_samples_split': [2, 5, 10],
        'model__min_samples_leaf': [1, 2, 4],
        'model__bootstrap': [True, False]
    },
    {  # Param cho GradientBoostingRegressor
        'model': [GradientBoostingRegressor(random_state=42)],
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [3, 5, 7],
        'model__learning_rate': [0.01, 0.1, 0.2],
        'model__subsample': [0.8, 1.0]
    },
    {  # Param cho AdaBoostRegressor
        'model': [AdaBoostRegressor(random_state=42)],
        'model__n_estimators': [50, 100, 200],
        'model__learning_rate': [0.01, 0.1, 0.2]
    },
    {  # Param cho XGBoost
        'model': [xgb.XGBRegressor(objective='reg:squarederror', random_state=42)],
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [3, 5, 7],
        'model__learning_rate': [0.01, 0.1, 0.2],
        'model__subsample': [0.8, 1.0],
        'model__colsample_bytree': [0.8, 1.0]
    },
    {  # Param cho SVR
        'model': [SVR()],
        'model__kernel': ['linear', 'rbf'],
        'model__C': [0.1, 1, 10],
        'model__gamma': ['scale', 'auto']
    },
    {  # Param cho KNeighborsRegressor
        'model': [KNeighborsRegressor()],
        'model__n_neighbors': [3, 5, 7],
        'model__weights': ['uniform', 'distance'],
        'model__algorithm': ['auto', 'ball_tree', 'kd_tree']
    },
    {  # Param cho LinearRegression
        'model': [LinearRegression()]
    },
    {  # Param cho Ridge Regression
        'model': [Ridge()],
        'model__alpha': [0.1, 1.0, 10.0]
    },
    {  # Param cho Lasso Regression
        'model': [Lasso()],
        'model__alpha': [0.1, 1.0, 10.0]
    }
]

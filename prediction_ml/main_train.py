from train import load_and_preprocess_data, train_model, evaluate_model, plot_predictions, param_grid
from train.config import pipeline
import joblib

from sklearn.model_selection import GridSearchCV
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_percentage_error
import numpy as np

# Load và preprocess dữ liệu
file_path = './database/test.csv'
data = load_and_preprocess_data(file_path)

# Loại bỏ cột Timestamp cho quá trình training
X = data.drop(columns=['Timestamp'])

models = {}
for column in X.columns:
    y = X[column]

    # Kiểm tra và loại bỏ các giá trị NaN trong y
    if y.isna().any():
        non_nan_indices = ~y.isna()
        X_clean = X[non_nan_indices].drop(columns=[column])
        y_clean = y[non_nan_indices]
    else:
        X_clean = X.drop(columns=[column])
        y_clean = y

    # Tìm kiếm mô hình tốt nhất cho cột hiện tại
    grid_search = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1, scoring='r2')
    grid_search.fit(X_clean, y_clean)
    best_model = grid_search.best_estimator_

    # Đánh giá mô hình
    y_pred = best_model.predict(X_clean)
    mse = mean_squared_error(y_clean, y_pred)
    r2 = r2_score(y_clean, y_pred)
    mape = mean_absolute_percentage_error(y_clean, y_pred)
    accuracy = 100 * (1 - mape)  # Chuyển MAPE thành một dạng "accuracy"

    models[column] = best_model
    print(f'{column}: MSE={mse}, R2={r2}, Accuracy={accuracy}%')

    # Bạn có thể thêm hàm plot_predictions nếu cần vẽ biểu đồ
    plot_predictions(y_clean, y_pred, column)

# Lưu các model đã train
joblib.dump(models, 'models_pipeline.pkl')

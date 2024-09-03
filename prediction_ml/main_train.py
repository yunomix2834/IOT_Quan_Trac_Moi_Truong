from train import load_and_preprocess_data, train_model, evaluate_model, plot_predictions, param_grid
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from train.config import pipeline
import numpy as np

# Load và preprocess dữ liệu
file_path = './database/database_15k.csv'
data = load_and_preprocess_data(file_path)

# Tách đặc trưng và nhãn
X = data[['Timestamp', 'Hour', 'Day', 'Month']]
y_columns = ['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain']

# Chia dữ liệu thành tập huấn luyện, tập validation và tập kiểm tra
X_train, X_temp, y_train_dict, y_temp_dict = train_test_split(X, data[y_columns], test_size=0.3, random_state=42)
X_train = X_train.replace([np.inf, -np.inf], np.nan).dropna()
X_val, X_test, y_val_dict, y_test_dict = train_test_split(X_temp, y_temp_dict, test_size=0.5, random_state=42)

models = {}
results = {}

for column in y_columns:
    y_train = y_train_dict[column]
    y_val = y_val_dict[column]
    y_test = y_test_dict[column]

    # Thực hiện GridSearch để tìm mô hình và tham số tốt nhất
    grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, cv=5, n_jobs=-1, scoring='r2')
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_

    # Đánh giá mô hình trên tập validation
    mse_val, r2_val, accuracy_val, y_pred_val = evaluate_model(best_model, X_val, y_val)

    print(f'{column} - Validation: MSE={mse_val}, R2={r2_val}, Accuracy={accuracy_val}%')

    # Đánh giá mô hình trên tập kiểm tra
    mse_test, r2_test, accuracy_test, y_pred_test = evaluate_model(best_model, X_test, y_test)

    print(f'{column} - Test: MSE={mse_test}, R2={r2_test}, Accuracy={accuracy_test}%')

    # Lưu kết quả vào dictionary để tiện theo dõi
    results[column] = {
        'validation': {
            'mse': mse_val,
            'r2': r2_val,
            'accuracy': accuracy_val,
            'pred': y_pred_val
        },
        'test': {
            'mse': mse_test,
            'r2': r2_test,
            'accuracy': accuracy_test,
            'pred': y_pred_test
        }
    }

    plot_predictions(y_test, y_pred_test, f'{column} - Test')

    models[column] = best_model

# Lưu các model đã train
joblib.dump(models, 'models_pipeline_timestamp_with_validation.pkl')

# Optionally, save results for later analysis
joblib.dump(results, 'results_pipeline_timestamp_with_validation.pkl')
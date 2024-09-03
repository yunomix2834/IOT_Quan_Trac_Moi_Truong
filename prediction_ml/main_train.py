from train import load_and_preprocess_data, train_model, evaluate_model, plot_predictions, param_grid
import joblib

# Load và preprocess dữ liệu
file_path = './database/database_15k.csv'
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

    best_model, X_test, y_test = train_model(X_clean, y_clean, param_grid)
    mse, r2, accuracy, y_pred = evaluate_model(best_model, X_test, y_test)
    models[column] = best_model
    plot_predictions(y_test, y_pred, column)
    print(f'{column}: MSE={mse}, R2={r2}, Accuracy={accuracy}%')

# Lưu các model đã train
joblib.dump(models, 'models_pipeline.pkl')
import joblib

# Đường dẫn tới file .pkl
file_path = 'models_pipeline.pkl'

# Tải nội dung của file .pkl
data = joblib.load(file_path)

# Xem nội dung
print(data)

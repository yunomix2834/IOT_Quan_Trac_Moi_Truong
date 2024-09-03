import pandas as pd

def make_predictions(models, data):
    predictions = {}

    # Danh sách các đặc trưng đã được sử dụng trong quá trình huấn luyện
    expected_features = ['Timestamp', 'Hour', 'Day', 'Month', 'Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain']

    # Tạo một DataFrame từ dữ liệu đầu vào
    features = pd.DataFrame([{
        'Timestamp': data.get('Timestamp', 0),
        'Hour': data.get('Hour', 0),
        'Day': data.get('Day', 0),
        'Month': data.get('Month', 0),
        'Temperature': data.get('Temperature', 0),
        'Humidity': data.get('Humidity', 0),
        'DustDensity': data.get('DustDensity', 0),
        'MQ7': data.get('MQ7', 0),
        'Light': data.get('Light', 0),
        'Rain': data.get('Rain', 0)
    }])

    # Chỉ giữ lại những cột đã được sử dụng trong quá trình huấn luyện
    features = features[expected_features]

    # Dự đoán cho từng mô hình
    for target, model in models.items():
        prediction = model.predict(features)[0]
        predictions[target] = prediction

    return predictions

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def remove_outliers(df, columns, threshold=3):
    for column in columns:
        mean = df[column].mean()
        std = df[column].std()
        df = df[(df[column] > mean - threshold * std) & (df[column] < mean + threshold * std)]
    return df

def load_and_preprocess_data(file_path):
    data = pd.read_csv(file_path)

    # Kiểm tra và xử lý các giá trị âm trong 'DustDensity'
    data['DustDensity'] = data['DustDensity'].apply(lambda x: np.nan if x < 0 else x)
    data['DustDensity'] = data['DustDensity'].interpolate(method='linear')

    # Loại bỏ các giá trị mưa không hợp lệ
    invalid_rain_indices = data[(data['Rain'] < 600)].index
    data.loc[invalid_rain_indices, 'Rain'] = np.nan
    data['Rain'] = data['Rain'].interpolate(method='linear')

    # Chuyển đổi cột 'Timestamp' thành định dạng datetime
    data['Timestamp'] = pd.to_datetime(data['Timestamp'])

    # Loại bỏ các giá trị ngoại lệ trên các cột chính
    columns_to_check = ['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain']
    data = remove_outliers(data, columns_to_check)

    # Tạo thêm các đặc trưng từ Timestamp như giờ, ngày, tháng
    data['Hour'] = data['Timestamp'].dt.hour
    data['Day'] = data['Timestamp'].dt.day
    data['Month'] = data['Timestamp'].dt.month

    return data

# Load and preprocess the data
file_path = 'database_15k.csv'
data = load_and_preprocess_data(file_path)

# Visualize all columns and the sum of each column

plt.figure(figsize=(20, 15))

# Plot each feature over time
for i, column in enumerate(['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain']):
    plt.subplot(3, 2, i + 1)
    plt.plot(data['Timestamp'], data[column], label=f'{column} over Time')
    plt.title(f'{column} over Time')
    plt.xlabel('Timestamp')
    plt.ylabel(column)
    plt.legend()

# Display the total sum of each feature
total_sum = data[['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain']].sum()
print("Total Sum of Each Feature:")
print(total_sum)

plt.tight_layout()
plt.show()

import pandas as pd
import numpy as np

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

    data[columns_to_check] = data[columns_to_check].round(1)

    start_date = data['Timestamp'].min()
    end_date = start_date + pd.Timedelta(days=7)
    filtered_data = data[(data['Timestamp'] >= start_date) & (data['Timestamp'] <= end_date)]

    return filtered_data

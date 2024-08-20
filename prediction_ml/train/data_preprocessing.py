import pandas as pd
import numpy as np


def load_and_preprocess_data(file_path):
    data = pd.read_csv(file_path)
    data = data.drop(columns=['Id'])

    # Xử lý cột 'Rain'
    data['Rain'] = data['Rain'].str.replace('=', '').astype(float)

    # Kiểm tra và xử lý các giá trị âm trong 'DustDensity'
    data['DustDensity'] = data['DustDensity'].apply(lambda x: np.nan if x < 0 else x)

    # Thực hiện nội suy và điền giá trị NaN
    data['DustDensity'] = data['DustDensity'].interpolate(method='linear')

    # Thay thế fillna với phương pháp bfill và ffill
    data['DustDensity'] = data['DustDensity'].bfill()
    data['DustDensity'] = data['DustDensity'].ffill()

    # Chuyển đổi cột 'Timestamp' thành định dạng datetime
    data['Timestamp'] = pd.to_datetime(data['Timestamp'])

    # Lọc dữ liệu trong 2 ngày đầu tiên
    start_date = data['Timestamp'].min()
    end_date = start_date + pd.Timedelta(days=2)
    filtered_data = data[(data['Timestamp'] >= start_date) & (data['Timestamp'] <= end_date)]

    return filtered_data

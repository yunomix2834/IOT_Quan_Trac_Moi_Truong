import pandas as pd
import numpy as np

def load_and_preprocess_data(file_path):
    data = pd.read_csv(file_path)
    data = data.drop(columns=['Id'])
    data['Rain'] = data['Rain'].str.replace('=', '').astype(float)
    data['DustDensity'] = data['DustDensity'].apply(lambda x: np.nan if x < 0 else x)
    data['DustDensity'] = data['DustDensity'].interpolate(method='linear')
    data['Timestamp'] = pd.to_datetime(data['Timestamp'])
    start_date = data['Timestamp'].min()
    end_date = start_date + pd.Timedelta(days=2)
    filtered_data = data[(data['Timestamp'] >= start_date) & (data['Timestamp'] <= end_date)]
    return filtered_data

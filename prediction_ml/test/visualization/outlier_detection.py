import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy.stats import zscore

# Bước 1: Đọc dữ liệu từ file CSV
data = pd.read_csv("database_15k.csv")

# Bước 2: Tính toán Z-Score cho Rain, Humidity, Temperature, và Light
data['Rain_zscore'] = zscore(data['Rain'])
data['Humidity_zscore'] = zscore(data['Humidity'])
data['Temperature_zscore'] = zscore(data['Temperature'])
data['Light_zscore'] = zscore(data['Light'])

# Bước 3: Định nghĩa ngưỡng để xác định ngoại lệ
threshold = 3  # Ngưỡng thông dụng là 3 để phát hiện ngoại lệ

# Bước 4: Xác định các giá trị ngoại lệ dựa trên Z-Score
outlier_indices = data[(data['Rain_zscore'].abs() > threshold) |
                       (data['Humidity_zscore'].abs() > threshold) |
                       (data['Temperature_zscore'].abs() > threshold) |
                       (data['Light_zscore'].abs() > threshold)].index

# Bước 5: Đặt các giá trị Rain không hợp lệ thành NaN
data.loc[outlier_indices, 'Rain'] = np.nan

# Bước 6: Nội suy các giá trị NaN trong cột Rain
data['Rain'] = data['Rain'].interpolate(method='linear')

# Bước 7: Trực quan hóa dữ liệu Rain trước và sau khi xử lý ngoại lệ
plt.figure(figsize=(10, 6))

# Trước khi xử lý ngoại lệ
plt.subplot(2, 1, 1)
plt.plot(data['Timestamp'], data['Rain'], label='Before Handling Outliers')
plt.title('Rain Data Before and After Handling Outliers')
plt.xlabel('Timestamp')
plt.ylabel('Rain')
plt.legend()

# Sau khi xử lý ngoại lệ
plt.subplot(2, 1, 2)
plt.plot(data['Timestamp'], data['Rain'], label='After Handling Outliers')
plt.xlabel('Timestamp')
plt.ylabel('Rain')
plt.legend()

plt.tight_layout()
plt.show()

# Bước 8: Trực quan hóa mối tương quan giữa Rain và các cảm biến khác sau khi xử lý ngoại lệ
plt.figure(figsize=(10, 6))
plt.scatter(data['Rain'], data['Humidity'], label='Rain vs Humidity')
plt.scatter(data['Rain'], data['Temperature'], label='Rain vs Temperature')
plt.scatter(data['Rain'], data['Light'], label='Rain vs Light')
plt.title('Correlation Between Rain and Other Sensors After Handling Outliers')
plt.xlabel('Rain')
plt.ylabel('Sensor Values')
plt.legend()
plt.show()

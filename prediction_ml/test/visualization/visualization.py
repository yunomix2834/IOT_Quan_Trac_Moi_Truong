import pandas as pd
import matplotlib.pyplot as plt

# Đọc dữ liệu
df = pd.read_csv('database_15k.csv')

# Chuyển đổi cột Timestamp thành dạng datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

# Vẽ biểu đồ đường cho các cột
plt.figure(figsize=(14, 8))
plt.plot(df['Timestamp'], df['Temperature'], label='Temperature')
plt.plot(df['Timestamp'], df['Humidity'], label='Humidity')
plt.plot(df['Timestamp'], df['DustDensity'], label='DustDensity')
plt.plot(df['Timestamp'], df['MQ7'], label='MQ7')
plt.plot(df['Timestamp'], df['Light'], label='Light')
plt.plot(df['Timestamp'], df['Rain'], label='Rain')

plt.title('Các thông số cảm biến theo thời gian')
plt.xlabel('Timestamp')
plt.ylabel('Giá trị')
plt.legend()
plt.grid(True)
plt.show()

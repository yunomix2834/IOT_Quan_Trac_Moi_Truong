import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

data = pd.read_csv("database_15k.csv")

plt.figure(figsize=(10, 6))
plt.subplot(2, 1, 1)
plt.plot(data['Timestamp'], data['DustDensity'], label='Before Removing Negatives Interpolation')
plt.title('DustDensity Before and After Removing Negatives Interpolation')
plt.xlabel('Timestamp')
plt.ylabel('DustDensity')
plt.legend()

# Kiểm tra và xử lý các giá trị âm trong 'DustDensity'
data['DustDensity'] = data['DustDensity'].apply(lambda x: np.nan if x < 0 else x)
data['DustDensity'] = data['DustDensity'].interpolate(method='linear')


plt.subplot(2, 1, 2)
plt.plot(data['Timestamp'], data['DustDensity'], label='After Removing Negatives Interpolation')
plt.xlabel('Timestamp')
plt.ylabel('DustDensity')
plt.legend()

plt.tight_layout()
plt.show()

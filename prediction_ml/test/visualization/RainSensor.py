import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

data = pd.read_csv("database_15k.csv")

plt.figure(figsize=(10, 6))
plt.scatter(data['Rain'], data['Humidity'], label='Rain vs Humidity')
plt.scatter(data['Rain'], data['Temperature'], label='Rain vs Temperature')
plt.scatter(data['Rain'], data['Light'], label='Rain vs Light')
plt.title('Correlation Between Rain and Other Sensors')
plt.xlabel('Rain')
plt.ylabel('Sensor Values')
plt.legend()
plt.show()

plt.figure(figsize=(10, 6))
plt.subplot(2, 1, 1)
plt.plot(data['Timestamp'], data['Rain'], label='Before Handling Invalid Rain Data')
plt.title('Rain Data Before and After Handling Invalid Data')
plt.xlabel('Timestamp')
plt.ylabel('Rain')
plt.legend()

invalid_rain_indices = data[(data['Rain'] < 600) &
                            (data['Humidity'] > 79) &
                            (data['Light'] < 550) &
                            (data['Temperature'] > 33)
                            ].index


data.loc[invalid_rain_indices, 'Rain'] = np.nan
data['Rain'] = data['Rain'].interpolate(method='linear')


plt.subplot(2, 1, 2)
plt.plot(data['Timestamp'], data['Rain'], label='After Handling Invalid Rain Data')
plt.xlabel('Timestamp')
plt.ylabel('Rain')
plt.legend()

plt.tight_layout()
plt.show()
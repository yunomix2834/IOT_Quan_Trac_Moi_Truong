import numpy as np
import pandas as pd

def make_predictions(models, data):
    predictions = {}

    for target, model in models.items():
        if target == 'Temperature':
            features = pd.DataFrame([[
                data['Humidity'],
                data['DustDensity'],
                data['MQ7'],
                data['Light'],
                data['Rain']
            ]], columns=['Humidity', 'DustDensity', 'MQ7', 'Light', 'Rain'])
        elif target == 'Humidity':
            features = pd.DataFrame([[
                data['Temperature'],
                data['DustDensity'],
                data['MQ7'],
                data['Light'],
                data['Rain']
            ]], columns=['Temperature', 'DustDensity', 'MQ7', 'Light', 'Rain'])
        elif target == 'DustDensity':
            features = pd.DataFrame([[
                data['Temperature'],
                data['Humidity'],
                data['MQ7'],
                data['Light'],
                data['Rain']
            ]], columns=['Temperature', 'Humidity', 'MQ7', 'Light', 'Rain'])
        elif target == 'MQ7':
            features = pd.DataFrame([[
                data['Temperature'],
                data['Humidity'],
                data['DustDensity'],
                data['Light'],
                data['Rain']
            ]], columns=['Temperature', 'Humidity', 'DustDensity', 'Light', 'Rain'])
        elif target == 'Light':
            features = pd.DataFrame([[
                data['Temperature'],
                data['Humidity'],
                data['DustDensity'],
                data['MQ7'],
                data['Rain']
            ]], columns=['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Rain'])
        elif target == 'Rain':
            features = pd.DataFrame([[
                data['Temperature'],
                data['Humidity'],
                data['DustDensity'],
                data['MQ7'],
                data['Light']
            ]], columns=['Temperature', 'Humidity', 'DustDensity', 'MQ7', 'Light'])
        else:
            raise ValueError(f"Unexpected target: {target}")

        prediction = model.predict(features)[0]
        predictions[target] = prediction

    return predictions
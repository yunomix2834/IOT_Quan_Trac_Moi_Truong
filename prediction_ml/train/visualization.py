import matplotlib.pyplot as plt

def plot_predictions(y_test, y_pred, column_name):
    plt.figure(figsize=(10, 6))
    plt.plot(y_test.values, label='Actual')
    plt.plot(y_pred, label='Predicted')
    plt.title(f'Actual vs Predicted for {column_name}')
    plt.xlabel('Samples')
    plt.ylabel('Value')
    plt.legend()
    plt.show()

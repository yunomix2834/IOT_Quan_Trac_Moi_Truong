from flask import Flask, request, jsonify
from app.models import load_models
from app.utils import make_predictions

app = Flask(__name__)

models = load_models()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        predictions = make_predictions(models, data)

        predictions = {k: round(float(v), 1) for k, v in predictions.items()}

        return jsonify({'predictions': predictions})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

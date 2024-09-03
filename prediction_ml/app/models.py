import joblib

def load_models():
    return joblib.load('models_pipeline_timestamp_with_validation.pkl')

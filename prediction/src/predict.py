from pathlib import Path
import joblib

MODEL_PATH = Path(__file__).resolve().parent.parent / "random_forest_model.pkl"

model = joblib.load(MODEL_PATH)

def predict_match(features):
    probabilities = model.predict_proba(features)[0]
    model_prediction = model.predict(features)[0]

    if model_prediction == 0:
        prediction = 'H'
    elif model_prediction == 1:
        prediction = 'D'
    elif model_prediction == 2:
        prediction = 'A'

    return {
        "prediction": str(prediction),
        "home_win_probability": float(probabilities[0]),
        "draw_probability": float(probabilities[1]),
        "away_win_probability": float(probabilities[2])
    }
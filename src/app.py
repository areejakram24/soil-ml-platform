from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(
    title="Agricultural Soil Analytics Crop Recommendation API",
    description="Production API using a Random Forest model to recommend optimal crops based on soil composition.",
    version="1.0.0"
)

class SoilMetrics(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


MODEL_PATH = os.path.join("models", "soil_model.pkl")

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("Successfully loaded trained Random Forest model binary!")
else:
    model = None
    print(f"Model file not found at {MODEL_PATH}. Did you run training.py?")


@app.get("/")
def home():
    return {
        "status": "healthy",
        "engine_loaded": model is not None,
        "message": "Soil Analytics API is live and operational."
    }


@app.post("/predict")
def predict_crop(metrics: SoilMetrics):
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Predictive model is missing. Run training.py to create models/soil_model.pkl."
        )

    input_data = np.array([[
        metrics.nitrogen,
        metrics.phosphorus,
        metrics.potassium,
        metrics.temperature,
        metrics.humidity,
        metrics.ph,
        metrics.rainfall
    ]])

    prediction = model.predict(input_data)
    predicted_crop = str(prediction[0])

    return {
        "prediction": predicted_crop,
        "crop": predicted_crop,
        "recommended_crop": predicted_crop
    }
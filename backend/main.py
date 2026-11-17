
# ============================================================
# CHURNSHIELD AI - FASTAPI BACKEND
# ============================================================

import sys
import joblib
import pandas as pd

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analytics import router as analytics_router

# ------------------------------------------------------------
# 1. PROJECT PATH
# ------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "note book"

# Make root project modules accessible
sys.path.insert(0, str(BASE_DIR))

# Register custom preprocessing transformer
import churn_preprocessing

# ------------------------------------------------------------
# 2. LOAD SAVED ML ARTIFACTS
# ------------------------------------------------------------

model = joblib.load(MODEL_DIR / "final_model.joblib")

preprocessor = joblib.load(
    MODEL_DIR / "preprocessor.joblib"
)

best_threshold = float(
    joblib.load(MODEL_DIR / "best_threshold.joblib")
)

print("ChurnShield AI model loaded successfully!")
print("Optimized threshold:", best_threshold)

# ------------------------------------------------------------
# 3. FASTAPI APPLICATION
# ------------------------------------------------------------

app = FastAPI(
    title="ChurnShield AI API",
    description="AI-powered Customer Churn Prediction Platform",
    version="1.0.0"
)
app.include_router(analytics_router)


# ------------------------------------------------------------
# 4. CORS CONFIGURATION
# ------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# 5. CUSTOMER INPUT SCHEMA
# ------------------------------------------------------------

class CustomerData(BaseModel):

    gender: str
    SeniorCitizen: str
    Partner: str
    Dependents: str

    tenure: int

    PhoneService: str
    MultipleLines: str
    InternetService: str

    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str

    Contract: str
    PaperlessBilling: str
    PaymentMethod: str

    MonthlyCharges: float
    TotalCharges: float


# ------------------------------------------------------------
# 6. HOME ENDPOINT
# ------------------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to ChurnShield AI API",
        "status": "Backend is running"
    }


# ------------------------------------------------------------
# 7. HEALTH CHECK
# ------------------------------------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "ChurnShield AI"
    }


# ------------------------------------------------------------
# 8. CUSTOMER CHURN PREDICTION
# ------------------------------------------------------------

@app.post("/predict")
def predict_churn(customer: CustomerData):

    try:

        # Convert input into DataFrame
        input_data = pd.DataFrame(
            [customer.model_dump()]
        )

        # Apply saved preprocessing pipeline
        processed_data = preprocessor.transform(
            input_data
        )

        # Predict churn probability
        churn_probability = float(
            model.predict_proba(processed_data)[0][1]
        )

        # Apply optimized threshold
        prediction = int(
            churn_probability >= best_threshold
        )

        # Prediction result
        result = (
            "Churn"
            if prediction == 1
            else "No Churn"
        )

        return {

            "prediction": result,

            "churn_probability": round(
                churn_probability, 4
            ),

            "churn_probability_percent": round(
                churn_probability * 100, 2
            ),

            "threshold": round(
                best_threshold, 4
            ),

            "status": "success"

        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

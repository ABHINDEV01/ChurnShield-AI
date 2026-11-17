
# ============================================================
# CHURNSHIELD AI - ENTERPRISE MODEL ANALYTICS
# ============================================================

import joblib
import numpy as np
import pandas as pd

from pathlib import Path
from fastapi import APIRouter, HTTPException

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve
)

# ------------------------------------------------------------
# 1. PATH CONFIGURATION
# ------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "note book"

router = APIRouter(prefix="/analytics", tags=["Model Analytics"])

# ------------------------------------------------------------
# 2. LOAD SAVED ARTIFACTS
# ------------------------------------------------------------

model = joblib.load(MODEL_DIR / "final_model.joblib")

threshold = float(
    joblib.load(MODEL_DIR / "best_threshold.joblib")
)

feature_names = joblib.load(
    MODEL_DIR / "feature_names.joblib"
)

X_test = pd.read_csv(MODEL_DIR / "X_test.csv")
y_test = pd.read_csv(MODEL_DIR / "y_test.csv").squeeze()

# ------------------------------------------------------------
# 3. MODEL PREDICTIONS
# ------------------------------------------------------------

probabilities = model.predict_proba(X_test)[:, 1]

predictions = (
    probabilities >= threshold
).astype(int)

# ------------------------------------------------------------
# 4. PERFORMANCE METRICS
# ------------------------------------------------------------

accuracy = accuracy_score(y_test, predictions)
precision = precision_score(
    y_test, predictions, zero_division=0
)
recall = recall_score(
    y_test, predictions, zero_division=0
)
f1 = f1_score(
    y_test, predictions, zero_division=0
)
roc_auc = roc_auc_score(y_test, probabilities)

# ------------------------------------------------------------
# 5. CONFUSION MATRIX
# ------------------------------------------------------------

matrix = confusion_matrix(
    y_test,
    predictions,
    labels=[0, 1]
)

# ------------------------------------------------------------
# 6. ROC CURVE
# ------------------------------------------------------------

fpr, tpr, roc_thresholds = roc_curve(
    y_test,
    probabilities
)

# ------------------------------------------------------------
# 7. FEATURE IMPORTANCE
# ------------------------------------------------------------

if not hasattr(model, "feature_importances_"):
    raise RuntimeError(
        "The loaded model does not expose feature_importances_."
    )

importance = model.feature_importances_

if len(importance) != len(feature_names):
    raise RuntimeError(
        "Feature importance count does not match feature_names.joblib."
    )

feature_importance = sorted(
    [
        {
            "feature": str(name),
            "importance": float(value)
        }
        for name, value in zip(feature_names, importance)
    ],
    key=lambda item: item["importance"],
    reverse=True
)

# ------------------------------------------------------------
# 8. ANALYTICS ENDPOINT
# ------------------------------------------------------------

@router.get("/")
def get_model_analytics():

    return {
        "status": "success",
        "model": "XGBoost",
        "threshold": threshold,

        "dataset": {
            "test_samples": int(len(y_test)),
            "churn_customers": int((y_test == 1).sum()),
            "non_churn_customers": int((y_test == 0).sum())
        },

        "performance": {
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4),
            "roc_auc": round(float(roc_auc), 4)
        },

        "confusion_matrix": {
            "true_negative": int(matrix[0][0]),
            "false_positive": int(matrix[0][1]),
            "false_negative": int(matrix[1][0]),
            "true_positive": int(matrix[1][1])
        },

        "roc_curve": {
            "fpr": [float(x) for x in fpr],
            "tpr": [float(x) for x in tpr]
        },

        "feature_importance": feature_importance[:15]
    }

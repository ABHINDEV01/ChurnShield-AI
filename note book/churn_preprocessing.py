
import numpy as np
import pandas as pd

from sklearn.base import BaseEstimator, TransformerMixin


class ChurnFeatureEngineer(BaseEstimator, TransformerMixin):

    def fit(self, X, y=None):
        return self

    def transform(self, X):

        X = X.copy()

        # 1. Simplify service categories
        addon_cols = ["OnlineSecurity","OnlineBackup","DeviceProtection","TechSupport","StreamingTV","StreamingMovies","MultipleLines"]

        X[addon_cols] = X[addon_cols].replace({
            "No internet service": "No",
            "No phone service": "No"
        })

        # 2. Create number of additional services
        service_cols = ["OnlineSecurity","OnlineBackup","DeviceProtection","TechSupport","StreamingTV","StreamingMovies"]

        X["num_addons"] = (
            X[service_cols] == "Yes"
        ).sum(axis=1)

        # 3. Identify new customers
        X["is_new_customer"] = (
            X["tenure"] <= 12
        ).astype(int)

        # 4. Calculate average historical monthly charge
        X["avg_historical_monthly_charge"] = np.where(
            X["tenure"] > 0,
            X["TotalCharges"] / X["tenure"],
            X["MonthlyCharges"]
        )

        return X


const API_URL = "http://127.0.0.1:8000";

// Customer churn prediction
export async function predictChurn(customerData) {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(customerData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Prediction request failed"
      );
    }

    return result;
  } catch (error) {
    console.error("ChurnShield API Error:", error);
    throw error;
  }
}

// Model analytics dashboard
export async function getAnalytics() {
  try {
    const response = await fetch(`${API_URL}/analytics/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.detail || "Analytics request failed"
      );
    }

    return result;
  } catch (error) {
    console.error("ChurnShield Analytics Error:", error);
    throw error;
  }
}



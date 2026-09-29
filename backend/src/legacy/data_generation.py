from __future__ import annotations

from typing import Dict

import numpy as np
import pandas as pd


def generate_synthetic_admission_data(
    *,
    n_samples: int = 2000,
    seed: int = 42,
) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    gpa = np.clip(rng.normal(3.2, 0.35, size=n_samples), 2.0, 4.0)
    test_score = np.clip(rng.normal(1500, 180, size=n_samples), 900, 2000)
    extracurricular_score = np.clip(rng.normal(6.5, 2.0, size=n_samples), 0, 10)
    recommendation_score = np.clip(rng.normal(7.0, 1.5, size=n_samples), 0, 10)

    # Weighted score with noise for realistic distributions.
    raw_score = (
        0.45 * (gpa / 4.0)
        + 0.3 * (test_score / 2000.0)
        + 0.15 * (extracurricular_score / 10.0)
        + 0.1 * (recommendation_score / 10.0)
        + rng.normal(0.0, 0.05, size=n_samples)
    )

    # Logistic transform to derive admission probability.
    probability = 1.0 / (1.0 + np.exp(-9.0 * (raw_score - 0.58)))
    admission_status = rng.binomial(1, probability)

    data = pd.DataFrame(
        {
            "gpa": np.round(gpa, 2),
            "test_score": np.round(test_score).astype(int),
            "extracurricular_score": np.round(extracurricular_score).astype(int),
            "recommendation_score": np.round(recommendation_score).astype(int),
            "admission_status": admission_status.astype(int),
        }
    )

    return data


def data_profile_summary(df: pd.DataFrame) -> Dict[str, float]:
    return {
        "mean_gpa": float(df["gpa"].mean()),
        "mean_test_score": float(df["test_score"].mean()),
        "acceptance_rate": float(df["admission_status"].mean()),
    }

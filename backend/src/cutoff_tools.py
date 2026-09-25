from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Tuple


@dataclass(frozen=True)
class CutoffSearchConfig:
    max_gpa: float = 4.0
    max_test_score: int = 2000
    coarse_gpa_step: float = 0.05
    coarse_test_step: int = 20
    refine_gpa_step: float = 0.01
    refine_test_step: int = 10
    refine_gpa_window: float = 0.05
    refine_test_window: int = 40


def _clamp_float(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, float(value)))


def _clamp_int(value: int, min_value: int, max_value: int) -> int:
    return max(min_value, min(max_value, int(value)))


def calculate_cutoff(*, api: Any, data: Dict[str, Any], university: str) -> Dict[str, Any]:
    config = api.universities_config.get(university) or api.universities_config.get("university_a")
    thresholds = (config or {}).get("thresholds") or {}

    meets_thresholds = True
    gaps: Dict[str, float] = {}
    for key, threshold in thresholds.items():
        value = data.get(key, 0)
        try:
            gap = float(threshold) - float(value)
        except Exception:
            gap = 0.0
        if gap > 0:
            meets_thresholds = False
            gaps[key] = gap
        else:
            gaps[key] = 0.0

    return {
        "university": university,
        "thresholds": thresholds,
        "meets_basic_thresholds": meets_thresholds,
        "gaps": gaps,
    }


def predict_cutoff(
    *,
    api: Any,
    data: Dict[str, Any],
    university: str,
    target_probability: float,
    search: CutoffSearchConfig | None = None,
) -> Dict[str, Any]:
    search = search or CutoffSearchConfig()

    target_probability = _clamp_float(float(target_probability), 0.0, 1.0)

    current = api.predict(data, university)
    current_probability = float(current.get("probability", 0.0) or 0.0)

    gpa_start = _clamp_float(float(data.get("gpa", 0.0) or 0.0), 0.0, search.max_gpa)
    test_start = _clamp_int(int(data.get("test_score", 0) or 0), 0, search.max_test_score)

    if current_probability >= target_probability:
        return {
            "university": university,
            "target_probability": target_probability,
            "current_probability": current_probability,
            "recommended": {"gpa": gpa_start, "test_score": test_start},
            "predicted_probability": current_probability,
            "note": "Current profile already meets the target probability.",
        }

    def score_cost(gpa_value: float, test_value: int) -> float:
        # Normalize deltas to avoid overweighting test_score.
        return (gpa_value - gpa_start) / search.max_gpa + (test_value - test_start) / float(search.max_test_score)

    def evaluate(gpa_value: float, test_value: int) -> Tuple[float, float]:
        payload = dict(data)
        payload["gpa"] = float(gpa_value)
        payload["test_score"] = int(test_value)
        result = api.predict(payload, university)
        probability = float(result.get("probability", 0.0) or 0.0)
        return probability, score_cost(float(gpa_value), int(test_value))

    best_candidate: Tuple[float, int, float, float] | None = None  # gpa, test, prob, cost

    # Coarse grid search
    gpa = gpa_start
    while gpa <= search.max_gpa + 1e-9:
        test = test_start
        while test <= search.max_test_score:
            prob, cost = evaluate(gpa, test)
            if prob >= target_probability:
                if best_candidate is None or cost < best_candidate[3] or (cost == best_candidate[3] and prob > best_candidate[2]):
                    best_candidate = (float(gpa), int(test), float(prob), float(cost))
            test += search.coarse_test_step
        gpa = round(gpa + search.coarse_gpa_step, 10)

    # If nothing meets target, fall back to max values.
    if best_candidate is None:
        prob, _ = evaluate(search.max_gpa, search.max_test_score)
        return {
            "university": university,
            "target_probability": target_probability,
            "current_probability": current_probability,
            "recommended": {"gpa": search.max_gpa, "test_score": search.max_test_score},
            "predicted_probability": prob,
            "note": "Target probability is not reachable with the allowed ranges; returning max values.",
        }

    # Refine around best candidate
    best_gpa, best_test, _, _ = best_candidate
    gpa_min = _clamp_float(best_gpa - search.refine_gpa_window, gpa_start, search.max_gpa)
    gpa_max = _clamp_float(best_gpa + search.refine_gpa_window, gpa_start, search.max_gpa)
    test_min = _clamp_int(best_test - search.refine_test_window, test_start, search.max_test_score)
    test_max = _clamp_int(best_test + search.refine_test_window, test_start, search.max_test_score)

    refined_best = best_candidate

    gpa = gpa_min
    while gpa <= gpa_max + 1e-9:
        test = test_min
        while test <= test_max:
            prob, cost = evaluate(gpa, test)
            if prob >= target_probability:
                if cost < refined_best[3] or (cost == refined_best[3] and prob > refined_best[2]):
                    refined_best = (float(gpa), int(test), float(prob), float(cost))
            test += search.refine_test_step
        gpa = round(gpa + search.refine_gpa_step, 10)

    return {
        "university": university,
        "target_probability": target_probability,
        "current_probability": current_probability,
        "recommended": {"gpa": refined_best[0], "test_score": refined_best[1]},
        "predicted_probability": refined_best[2],
        "note": "Recommended cutoff values to meet the target probability.",
    }

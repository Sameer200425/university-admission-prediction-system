from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from threading import Lock
from typing import Any, Dict, Optional

from .data_preprocessing import DataPreprocessor
from .model_training import ModelTrainer


@dataclass
class TrainingState:
    status: str = "idle"
    started_at: Optional[str] = None
    finished_at: Optional[str] = None
    last_error: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None


class TrainingService:
    def __init__(
        self,
        *,
        api: Any,
        data_file: str,
        raw_data_path: str,
        processed_data_path: str,
        models_path: str,
    ) -> None:
        self._lock = Lock()
        self._api = api
        self._data_file = data_file
        self._raw_data_path = raw_data_path
        self._processed_data_path = processed_data_path
        self._models_path = models_path
        self.state = TrainingState()

    def run_retrain(self) -> None:
        if not self._lock.acquire(blocking=False):
            return
        try:
            self.state = TrainingState(status="running", started_at=datetime.now(timezone.utc).isoformat())
            preprocessor = DataPreprocessor(
                raw_data_path=self._raw_data_path,
                processed_data_path=self._processed_data_path,
            )
            df = preprocessor.preprocess_pipeline(self._data_file)
            X_train, X_test, y_train, y_test = preprocessor.split_data(df)

            trainer = ModelTrainer(models_path=self._models_path)
            best_model, sklearn_results, _ = trainer.train_all_models(X_train, y_train, X_test, y_test)

            metrics = {
                "best_model": getattr(trainer, "best_model_name", None),
                "best_score": trainer.best_score,
                "sklearn_results": {
                    name: {
                        "accuracy": float(result["accuracy"]),
                        "precision": float(result["precision"]),
                        "recall": float(result["recall"]),
                        "f1": float(result["f1"]),
                    }
                    for name, result in sklearn_results.items()
                },
            }

            self.state = TrainingState(
                status="succeeded",
                started_at=self.state.started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                metrics=metrics,
            )

            # Reload model in memory for live API usage.
            if hasattr(self._api, "load_model"):
                self._api.load_model()

        except Exception as exc:
            self.state = TrainingState(
                status="failed",
                started_at=self.state.started_at,
                finished_at=datetime.now(timezone.utc).isoformat(),
                last_error=str(exc),
            )
        finally:
            self._lock.release()

    def status(self) -> Dict[str, Any]:
        return asdict(self.state)

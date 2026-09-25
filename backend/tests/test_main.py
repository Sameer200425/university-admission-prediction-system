import pytest
import pandas as pd
import numpy as np

from src.data_preprocessing import DataPreprocessor
from src.prediction_api import PredictionAPI


class TestDataPreprocessor:
    def test_handle_missing_values(self):
        preprocessor = DataPreprocessor()
        df = pd.DataFrame({
            'gpa': [3.5, np.nan, 3.8],
            'test_score': [1500, 1600, np.nan],
            'category': ['A', 'B', None]
        })

        result = preprocessor.handle_missing_values(df)

        assert not result.isnull().any().any(), "Missing values should be handled"

    def test_encode_categorical(self):
        preprocessor = DataPreprocessor()
        df = pd.DataFrame({
            'category': ['A', 'B', 'A', 'C']
        })

        result = preprocessor.encode_categorical(df)

        assert result['category'].dtype == int, "Categorical column should be encoded"


class TestPredictionAPI:
    def test_preprocess_input(self):
        api = PredictionAPI()
        data = {
            'gpa': 3.5,
            'test_score': 1500,
            'extracurricular_score': 8,
            'recommendation_score': 9
        }

        result = api.preprocess_input(data)

        assert isinstance(result, np.ndarray), "Result should be numpy array"
        assert result.shape[1] == 4, "Should have 4 features"

    def test_validate_input_data(self):
        from src.utils import validate_input_data

        valid_data = {
            'gpa': 3.5,
            'test_score': 1500,
            'extracurricular_score': 8,
            'recommendation_score': 9
        }

        invalid_data = {
            'gpa': 'invalid',
            'test_score': 1500
        }

        assert validate_input_data(valid_data), "Valid data should pass validation"
        assert not validate_input_data(invalid_data), "Invalid data should fail validation"


if __name__ == "__main__":
    pytest.main([__file__])

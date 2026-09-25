import pandas as pd
import numpy as np
import os

from .data_generation import generate_synthetic_admission_data

try:
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.model_selection import train_test_split

    SKLEARN_AVAILABLE = True
except Exception:
    # Some Windows environments block native wheels (e.g. pyarrow), which can
    # break sklearn imports at runtime. Provide minimal fallbacks so the rest
    # of the project (and tests) can still run.
    SKLEARN_AVAILABLE = False

    class StandardScaler:  # type: ignore
        def __init__(self):
            self.mean_ = None
            self.scale_ = None

        def fit(self, X):
            arr = np.asarray(X, dtype=float)
            self.mean_ = arr.mean(axis=0)
            self.scale_ = arr.std(axis=0)
            self.scale_ = np.where(self.scale_ == 0, 1.0, self.scale_)
            return self

        def transform(self, X):
            arr = np.asarray(X, dtype=float)
            return (arr - self.mean_) / self.scale_

        def fit_transform(self, X):
            return self.fit(X).transform(X)

    class LabelEncoder:  # type: ignore
        def __init__(self):
            self._mapping = {}

        def fit_transform(self, values):
            uniques = pd.unique(pd.Series(values))
            self._mapping = {v: i for i, v in enumerate(uniques)}
            return np.array([self._mapping[v] for v in values], dtype=int)

    def train_test_split(X, y, test_size=0.2, random_state=42):  # type: ignore
        rng = np.random.RandomState(random_state)
        indices = np.arange(len(X))
        rng.shuffle(indices)

        test_count = int(len(indices) * test_size)
        test_idx = indices[:test_count]
        train_idx = indices[test_count:]

        X_train = X.iloc[train_idx]
        X_test = X.iloc[test_idx]
        y_train = y.iloc[train_idx]
        y_test = y.iloc[test_idx]
        return X_train, X_test, y_train, y_test


class DataPreprocessor:
    def __init__(self, raw_data_path='data/raw/', processed_data_path='data/processed/'):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        self.scaler = StandardScaler()
        self.label_encoders = {}

    def load_data(self, filename):
        """Load data from CSV file"""
        filepath = os.path.join(self.raw_data_path, filename)
        generate_synthetic = str(os.getenv("GENERATE_SYNTHETIC_DATA", "")).lower() in {"1", "true", "yes"}
        if not os.path.exists(filepath) or generate_synthetic:
            samples = int(os.getenv("SYNTHETIC_SAMPLE_COUNT", "2000"))
            df = generate_synthetic_admission_data(n_samples=samples)
            os.makedirs(self.raw_data_path, exist_ok=True)
            df.to_csv(filepath, index=False)
            return df
        return pd.read_csv(filepath)

    def handle_missing_values(self, df):
        """Handle missing values in the dataset"""
        # Fill numerical columns with median
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        df[numerical_cols] = df[numerical_cols].fillna(df[numerical_cols].median())

        # Fill categorical columns with mode
        categorical_cols = df.select_dtypes(include=['object', 'string']).columns
        for col in categorical_cols:
            df[col] = df[col].fillna(df[col].mode()[0])

        return df

    def encode_categorical(self, df):
        """Encode categorical variables"""
        categorical_cols = df.select_dtypes(include=['object', 'string']).columns
        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
            df[col] = self.label_encoders[col].fit_transform(df[col])
        return df

    def scale_features(self, df, target_col='admission_status'):
        """Scale numerical features"""
        features = df.drop(columns=[target_col])
        numerical_cols = features.select_dtypes(include=[np.number]).columns

        if not numerical_cols.empty:
            df_scaled = df.copy()
            df_scaled[numerical_cols] = self.scaler.fit_transform(df_scaled[numerical_cols])
            return df_scaled
        return df

    def preprocess_pipeline(self, filename, target_col='admission_status'):
        """Complete preprocessing pipeline"""
        # Load data
        df = self.load_data(filename)

        # Handle missing values
        df = self.handle_missing_values(df)

        # Encode categorical variables
        df = self.encode_categorical(df)

        # Scale features
        df = self.scale_features(df, target_col)

        # Save processed data
        processed_filename = f"processed_{filename}"
        processed_filepath = os.path.join(self.processed_data_path, processed_filename)
        df.to_csv(processed_filepath, index=False)

        return df

    def split_data(self, df, target_col='admission_status', test_size=0.2, random_state=42):
        """Split data into train and test sets"""
        X = df.drop(columns=[target_col])
        y = df[target_col]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

        return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    preprocessor = DataPreprocessor()
    # Example usage
    df = preprocessor.preprocess_pipeline('admission_data.csv')
    print("Data preprocessing completed.")
    print(f"Processed data shape: {df.shape}")

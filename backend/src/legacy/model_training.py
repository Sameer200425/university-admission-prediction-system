import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

try:
    import tensorflow as tf
    from tensorflow import keras

    TENSORFLOW_AVAILABLE = True
except Exception:
    TENSORFLOW_AVAILABLE = False

from sklearn.model_selection import GridSearchCV
import joblib
import os

from .data_preprocessing import DataPreprocessor


class ModelTrainer:
    def __init__(self, models_path='models/'):
        self.models_path = models_path
        self.models = {
            'random_forest': RandomForestClassifier(random_state=42),
            'logistic_regression': LogisticRegression(random_state=42),
            'svm': SVC(random_state=42, probability=True)
        }
        self.best_model = None
        self.best_score = 0
        self.best_model_name = None

    def train_sklearn_models(self, X_train, y_train, X_test, y_test):
        """Train and evaluate scikit-learn models"""
        results = {}

        for name, model in self.models.items():
            # Hyperparameter tuning for Random Forest
            if name == 'random_forest':
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5, 10]
                }
                grid_search = GridSearchCV(model, param_grid, cv=5, scoring='accuracy')
                grid_search.fit(X_train, y_train)
                model = grid_search.best_estimator_

            # Train model
            model.fit(X_train, y_train)

            # Predictions
            y_pred = model.predict(X_test)

            # Evaluate
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, average='weighted')
            recall = recall_score(y_test, y_pred, average='weighted')
            f1 = f1_score(y_test, y_pred, average='weighted')

            results[name] = {
                'model': model,
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1': f1
            }

            # Track best model
            if accuracy > self.best_score:
                self.best_score = accuracy
                self.best_model = model
                self.best_model_name = name

        return results

    def build_neural_network(self, input_shape):
        """Build a neural network using TensorFlow"""
        if not TENSORFLOW_AVAILABLE:
            raise RuntimeError("TensorFlow not available")

        model = keras.Sequential([
            keras.layers.Dense(128, activation='relu', input_shape=(input_shape,)),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])

        model.compile(optimizer='adam',
                      loss='binary_crossentropy',
                      metrics=['accuracy'])

        return model

    def train_neural_network(self, X_train, y_train, X_test, y_test, epochs=50, batch_size=32):
        """Train the neural network"""
        input_shape = X_train.shape[1]
        model = self.build_neural_network(input_shape)

        # Train the model
        history = model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            verbose=1
        )

        # Evaluate
        loss, accuracy = model.evaluate(X_test, y_test, verbose=0)

        # If better than sklearn models, use this
        if accuracy > self.best_score:
            self.best_score = accuracy
            self.best_model = model
            self.best_model_name = 'neural_network'

        return model, history, accuracy

    def save_model(self, model, filename):
        """Save the trained model"""
        filepath = os.path.join(self.models_path, filename)
        if TENSORFLOW_AVAILABLE:
            try:
                if isinstance(model, keras.Model):
                    model.save(filepath)
                    return
            except Exception:
                pass

        joblib.dump(model, filepath)

    def load_model(self, filename):
        """Load a saved model"""
        filepath = os.path.join(self.models_path, filename)
        if (filename.endswith('.h5') or filename.endswith('.keras')) and TENSORFLOW_AVAILABLE:
            return keras.models.load_model(filepath)
        return joblib.load(filepath)

    def train_all_models(self, X_train, y_train, X_test, y_test):
        """Train all models and select the best one"""
        print("Training scikit-learn models...")
        sklearn_results = self.train_sklearn_models(X_train, y_train, X_test, y_test)

        if TENSORFLOW_AVAILABLE:
            print("Training neural network...")
            nn_model, history, nn_accuracy = self.train_neural_network(X_train, y_train, X_test, y_test)
        else:
            print("TensorFlow not available, skipping neural network training.")
            nn_model, history, nn_accuracy = None, None, 0

        print(f"Best model: {self.best_model_name} with accuracy: {self.best_score:.4f}")

        # Save the best model
        self.save_model(self.best_model, f'best_model_{self.best_model_name}.joblib')

        return self.best_model, sklearn_results, nn_model


if __name__ == "__main__":
    # Example usage
    preprocessor = DataPreprocessor(raw_data_path='data/raw/', processed_data_path='data/processed/')
    df = preprocessor.preprocess_pipeline('admission_data.csv')
    X_train, X_test, y_train, y_test = preprocessor.split_data(df)

    trainer = ModelTrainer(models_path='models/')
    best_model, sklearn_results, nn_model = trainer.train_all_models(X_train, y_train, X_test, y_test)

    print("Model training completed.")

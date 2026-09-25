import os
import yaml
import json
from typing import Dict, Any, List, Optional
import logging
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def load_config(config_file: str = 'config/config.yaml') -> Dict[str, Any]:
    """Load configuration from YAML file"""
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            return yaml.safe_load(f)
    else:
        logger.warning(f"Config file {config_file} not found. Using default config.")
        return get_default_config()


def get_default_config() -> Dict[str, Any]:
    """Get default configuration"""
    return {
        'app': {
            'name': 'University Admission Prediction System',
            'version': '1.0.0',
            'host': '0.0.0.0',
            'port': 8000
        },
        'database': {
            'type': 'sqlite',
            'path': 'data/admission_data.db'
        },
        'models': {
            'path': 'models/',
            'default_model': 'best_model_random_forest.joblib'
        },
        'universities': {
            'default': 'university_a',
            'supported': ['university_a', 'university_b']
        }
    }


def save_config(config: Dict[str, Any], config_file: str = 'config/config.yaml'):
    """Save configuration to YAML file"""
    os.makedirs(os.path.dirname(config_file), exist_ok=True)
    with open(config_file, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)


def validate_input_data(data: Dict[str, Any]) -> bool:
    """Validate input data for prediction"""
    required_fields = ['gpa', 'test_score', 'extracurricular_score', 'recommendation_score']
    for field in required_fields:
        if field not in data:
            logger.error(f"Missing required field: {field}")
            return False
        if not isinstance(data[field], (int, float)):
            logger.error(f"Invalid type for field {field}: {type(data[field])}")
            return False
    return True


def calculate_admission_score(data: Dict[str, Any], weights: Dict[str, float]) -> float:
    """Calculate weighted admission score"""
    score = 0.0
    for field, weight in weights.items():
        score += data.get(field, 0) * weight
    return score


def get_university_requirements(university: str) -> Optional[Dict[str, Any]]:
    """Get admission requirements for a specific university"""
    requirements = {
        'university_a': {
            'min_gpa': 3.0,
            'min_test_score': 1500,
            'required_subjects': ['Math', 'English']
        },
        'university_b': {
            'min_gpa': 3.5,
            'min_test_score': 1600,
            'required_subjects': ['Math', 'Science', 'English']
        },
        'university_c': {
            'min_gpa': 3.2,
            'min_test_score': 1550,
            'required_subjects': ['Math', 'English']
        },
        'university_d': {
            'min_gpa': 3.7,
            'min_test_score': 1650,
            'required_subjects': ['Math', 'Science', 'English']
        },
        'university_e': {
            'min_gpa': 3.0,
            'min_test_score': 1450,
            'required_subjects': ['English']
        }
    }
    try:
        from .db import get_session, get_university_requirements as db_get_requirements

        for session in get_session():
            db_req = db_get_requirements(session, university)
            if db_req:
                return db_req
    except Exception:
        pass

    return requirements.get(university)


def log_prediction(student_id: str, prediction: Dict[str, Any]):
    """Log prediction results"""
    log_entry = {
        'student_id': student_id,
        'prediction': prediction,
        'timestamp': str(pd.Timestamp.now())
    }
    logger.info(f"Prediction logged: {log_entry}")


def export_results(results: List[Dict[str, Any]], filename: str):
    """Export prediction results to CSV"""
    df = pd.DataFrame(results)
    df.to_csv(filename, index=False)
    logger.info(f"Results exported to {filename}")


def setup_directories():
    """Create necessary directories if they don't exist"""
    directories = ['data/raw', 'data/processed', 'models', 'config', 'logs']
    for dir_path in directories:
        os.makedirs(dir_path, exist_ok=True)
        logger.info(f"Directory created: {dir_path}")


def get_model_metrics(model_name: str) -> Dict[str, float]:
    """Get stored metrics for a model"""
    metrics_file = f'models/{model_name}_metrics.json'
    if os.path.exists(metrics_file):
        with open(metrics_file, 'r') as f:
            return json.load(f)
    else:
        return {'accuracy': 0.0, 'precision': 0.0, 'recall': 0.0, 'f1': 0.0}


def save_model_metrics(model_name: str, metrics: Dict[str, float]):
    """Save model metrics"""
    metrics_file = f'models/{model_name}_metrics.json'
    with open(metrics_file, 'w') as f:
        json.dump(metrics, f, indent=2)


# Initialize directories on import
setup_directories()

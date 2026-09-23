"""
Main ML Test Runner
Consolidated test suite for the ML pipeline.
Run with: python -m pytest test_ml.py -v
"""

import pytest
import sys
from pathlib import Path

# Add ml directory to path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    # Run all test modules
    test_files = [
        "tests/test_data.py",
        "tests/test_model.py", 
        "tests/test_api.py",
        "tests/test_pipeline.py"
    ]
    
    exit_code = pytest.main(test_files + ["-v", "--tb=short"])
    sys.exit(exit_code)
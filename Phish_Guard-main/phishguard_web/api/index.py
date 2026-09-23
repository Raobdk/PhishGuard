import os
import sys

# Add the 'backend' directory to sys.path so modules like 'fallback_data' can be found
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)

# Add the parent directory so 'backend' itself can be imported as a module
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app import app

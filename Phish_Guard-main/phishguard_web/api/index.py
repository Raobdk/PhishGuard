import os
import sys

# Add the parent directory to sys.path so 'backend' can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app import app

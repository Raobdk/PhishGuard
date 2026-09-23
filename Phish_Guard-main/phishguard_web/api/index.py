import os
import sys

backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_path)
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app import app
from urllib.parse import parse_qs

class VercelPathMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        # Vercel rewrites change PATH_INFO to /api/index.py
        # We pass the original path as ?__path=...
        query = parse_qs(environ.get('QUERY_STRING', ''))
        if '__path' in query:
            original_path = query['__path'][0]
            environ['PATH_INFO'] = '/api/' + original_path
        
        return self.app(environ, start_response)

app.wsgi_app = VercelPathMiddleware(app.wsgi_app)

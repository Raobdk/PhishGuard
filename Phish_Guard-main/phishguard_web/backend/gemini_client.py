"""
gemini_client.py
Server-side Gemini helper. The API key lives ONLY on the server (env var or .env)
and is never sent to the browser.
"""

import os
import json
import time

import requests

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)


class GeminiError(Exception):
    """Raised with a short, user-presentable message."""


def has_key() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY", "").strip())


def _to_gemini_contents(messages):
    """Gemini uses role 'user' / 'model' (not 'assistant'), and a 'parts' list per turn."""
    contents = []
    for m in messages:
        role = "model" if m.get("role") == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": m.get("content", "")}]})
    return contents


def ask_gemini(system_msg: str, messages, temperature: float = 0.7, retries: int = 1) -> str:
    """messages: a str (single user message) or a list of {role, content} dicts."""
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise GeminiError("GEMINI_API_KEY is not set.")

    if isinstance(messages, str):
        messages = [{"role": "user", "content": messages}]

    payload = {
        "system_instruction": {"parts": [{"text": system_msg}]},
        "contents": _to_gemini_contents(messages),
        "generationConfig": {"temperature": temperature},
    }
    headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}

    last_error = "Unknown error."
    for attempt in range(retries + 1):
        try:
            resp = requests.post(GEMINI_URL, headers=headers, json=payload, timeout=25)
        except requests.exceptions.RequestException as exc:
            last_error = f"Could not reach Gemini ({exc.__class__.__name__})."
        else:
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    parts = data["candidates"][0]["content"]["parts"]
                    return "".join(p.get("text", "") for p in parts)
                except (KeyError, IndexError, ValueError):
                    last_error = "Gemini returned an unexpected response."
            elif resp.status_code in (401, 403):
                raise GeminiError("Gemini rejected the API key. Check GEMINI_API_KEY.")
            elif resp.status_code == 429:
                last_error = "Gemini rate limit reached. Try again in a moment."
            else:
                last_error = f"Gemini error (HTTP {resp.status_code})."
        if attempt < retries:
            time.sleep(1.0)
    raise GeminiError(last_error)


def extract_json_array(content: str):
    """Models sometimes wrap JSON in ``` fences or add chatter. Pull out the array."""
    text = content.strip()
    start, end = text.find("["), text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON array found")
    return json.loads(text[start:end + 1])

# PhishGuard Web

Your Tkinter PhishGuard project as a website: **Python (Flask) backend** + **React/TypeScript frontend** (`webapp/`), running on your own computer.

## Run it

1. Install Python 3.9+ and Node.js 18+.
2. Build the frontend once (or after any frontend change):
   ```
   cd webapp
   npm install
   npm run build
   cd ..
   ```
3. Start the backend, which now serves the built frontend:
   ```
   pip install -r requirements.txt
   cd backend
   python app.py
   ```
   (Shortcut: double-click `start.bat` on Windows, or run `./start.sh` on macOS/Linux — these only handle the Python side, so run the `npm` steps first.)
4. Open the address it prints, normally **http://127.0.0.1:8000**

Stop the server with `Ctrl+C`.

### Frontend development mode

To iterate on the UI with hot-reload, run the backend (`python app.py`) in one terminal and, in another, `cd webapp && npm run dev`. Vite serves the UI on its own port (usually 5173) and proxies `/api/*` calls to the Flask server automatically (see `webapp/vite.config.ts`).

## AI features (optional)

Quiz, Email Simulator and Chat use Gemini when a key is available. Without one they automatically use a built-in offline bank, so nothing ever errors.

1. Get a free key at aistudio.google.com/app/apikey
2. Copy `.env.example` to `.env` and paste the key after `GEMINI_API_KEY=`
3. Restart `python app.py`. The badge (top right) turns green.

The key stays on the server and is never sent to the browser.

## Structure

```
backend/   app.py (Flask server + API), gemini_client.py, modules_data.py,
           modules.txt, fallback_data.py, lab_data.py
webapp/    React + TypeScript + Tailwind frontend (source). `npm run build`
           outputs webapp/dist, which app.py serves at http://127.0.0.1:8000
```

## Notes

- The server only listens on 127.0.0.1 (your machine). The Victim/Attacker Lab is a client-side simulation:
  what you type on the fake login page never reaches the server.
- Set a different port with the `PORT` environment variable.

## Security

- Never commit `.env`. It is listed in `.gitignore`; only `.env.example` (placeholder values) belongs in the repo.
- If a real key was ever committed or shared, revoke it in Google AI Studio and create a new one.

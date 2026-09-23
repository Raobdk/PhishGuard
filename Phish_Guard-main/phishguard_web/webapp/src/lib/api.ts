/**
 * Thin client for the PhishGuard Flask API.
 *
 * All paths are relative ('/api/...') so this works unmodified in both setups:
 *  - dev:  `npm run dev` (Vite) proxies /api to the Flask server (see vite.config.ts)
 *  - prod: `npm run build` output is served BY Flask itself, same origin
 */

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && 'error' in body && String((body as { error: unknown }).error)) ||
      `Request to ${path} failed (${res.status})`;
    throw new Error(message);
  }

  return body as T;
}

export interface ApiQuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface ApiEmail {
  from_name: string;
  from_email: string;
  subject: string;
  body: string;
  url: string;
  is_phishing: boolean;
  red_flags: string[];
}

export interface ApiSlideBlock {
  kind: 'p' | 'lines';
  text?: string;
  lines?: string[];
}

export interface ApiSlide {
  heading: string;
  blocks: ApiSlideBlock[];
  highlight: string;
}

export interface ApiModule {
  title: string;
  icon: string;
  slides: ApiSlide[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const api = {
  health: () => request<{ ai: boolean }>('/api/health'),

  quiz: () =>
    request<{ source: 'ai' | 'offline'; notice?: string; questions: ApiQuizQuestion[] }>('/api/quiz'),

  simulator: () =>
    request<{ source: 'ai' | 'offline'; notice?: string; emails: ApiEmail[] }>('/api/simulator'),

  modules: () => request<{ modules: ApiModule[] } | { error: string }>('/api/modules'),

  lab: () => request<Record<string, unknown>>('/api/lab'),

  chat: (messages: ChatMessage[]) =>
    request<{ source: 'ai' | 'offline'; notice?: string; reply: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
};

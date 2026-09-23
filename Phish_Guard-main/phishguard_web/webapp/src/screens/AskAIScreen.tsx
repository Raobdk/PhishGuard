import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User, Sparkles, RotateCcw } from 'lucide-react';
import { SimBadge } from '@/components/SimBadge';
import { api, type ChatMessage } from '@/lib/api';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const suggestedQuestions = [
  'How can I spot a phishing email?',
  'What is spear phishing?',
  'How does DMARC work?',
  'What should I do if I clicked a phishing link?',
];

const WELCOME: Message = {
  id: 0,
  role: 'ai',
  text: "Hello! I'm your AI security advisor. Ask me anything about phishing, social engineering, or cybersecurity best practices.",
};

export function AskAIScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isTyping) return;

    const nextMessages: Message[] = [...messages, { id: Date.now(), role: 'user', text: message }];
    setMessages(nextMessages);
    setInput('');
    setIsTyping(true);
    setNotice(null);

    const history: ChatMessage[] = nextMessages
      .filter((m) => m.id !== WELCOME.id)
      .map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));

    try {
      const res = await api.chat(history);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: res.reply }]);
      if (res.source === 'offline' && res.notice) setNotice(res.notice);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: "I couldn't reach the server just now. Please check that the backend is running and try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    setInput('');
    setNotice(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="text-defender" size={24} />
          <h1 className="text-2xl font-bold text-white">Ask the AI</h1>
          <SimBadge />
        </div>
        <p className="text-sm text-muted">Chat with an AI security advisor about any cybersecurity topic.</p>
        {notice && <p className="text-xs text-warning/80 font-mono mt-2">{notice}</p>}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === 'user'
                ? 'bg-defender/10 border-defender/20'
                : 'bg-toxic/10 border-toxic/20'
            }`}>
              {msg.role === 'user' ? (
                <User size={16} className="text-defender" />
              ) : (
                <Bot size={16} className="text-toxic" />
              )}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-defender/10 border border-defender/15 text-white'
                : 'glass text-muted-light'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-toxic/10 border border-toxic/20">
              <Bot size={16} className="text-toxic" />
            </div>
            <div className="glass px-4 py-3 rounded-2xl">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-toxic/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-toxic/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-toxic/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="mb-3">
          <p className="text-xs text-muted-dark font-mono mb-2 flex items-center gap-1">
            <Sparkles size={12} /> Suggested questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-lg text-xs glass glass-hover text-muted-light hover:text-defender-light"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          className="p-2.5 rounded-lg glass glass-hover text-muted hover:text-defender-light shrink-0"
          title="Reset chat"
        >
          <RotateCcw size={16} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about phishing, social engineering, defense..."
          className="flex-1 px-4 py-2.5 rounded-lg glass text-sm text-white placeholder-muted-dark focus:outline-none focus:border-defender/30"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="btn-glow p-2.5 rounded-lg bg-defender/15 border border-defender/30 text-defender hover:bg-defender/25 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

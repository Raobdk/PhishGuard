import { useState, useEffect } from 'react';
import { Lock, Globe, Mail, Star, Reply, Forward, Trash, X, ShieldAlert, User } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { SimBadge } from './SimBadge';
import type { LabPhase } from '@/types';

interface VictimBoxProps {
  phase: LabPhase;
  onPhaseChange: (phase: LabPhase) => void;
}

export function VictimBox({ phase, onPhaseChange }: VictimBoxProps) {
  const [view, setView] = useState<'inbox' | 'email' | 'login'>('inbox');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);

  useEffect(() => {
    if (phase === 'captured') {
      setShowCaptureFlash(true);
      const timer = setTimeout(() => setShowCaptureFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setFormError('Please enter your credentials.');
      return;
    }
    setFormError('');
    onPhaseChange('captured');
  };

  const resetVictim = () => {
    setView('inbox');
    setCredentials({ username: '', password: '' });
    setFormError('');
  };

  return (
    <div className="relative flex flex-col h-full rounded-xl overflow-hidden border border-defender/20 bg-base-900/80 shadow-lg shadow-defender/5">
      {/* Red flash overlay */}
      {showCaptureFlash && (
        <div className="absolute inset-0 z-50 bg-danger/40 animate-flash-red pointer-events-none" />
      )}

      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-base-850/80 border-b border-defender/15">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-danger/80" />
          <span className="w-3 h-3 rounded-full bg-warning/80" />
          <span className="w-3 h-3 rounded-full bg-toxic/80" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-md bg-base-950/60 border border-base-700/40">
          <Lock size={12} className="text-toxic/60" />
          <span className="font-mono text-xs text-muted-light truncate">
            https://secure-bank-login.example-sim.com
          </span>
          <Globe size={12} className="text-muted ml-auto" />
        </div>
        <div className="flex items-center gap-2">
          <SimBadge />
          <StatusPill status={phase === 'captured' ? 'captured' : phase === 'idle' ? 'idle' : 'active'} />
        </div>
      </div>

      {/* Content area */}
      <div className="relative flex-1 overflow-y-auto bg-white/[0.02]">
        {view === 'inbox' && (
          <div className="animate-fade-in">
            {/* Inbox header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-base-700/30">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-defender" />
                <span className="text-sm font-semibold text-defender-light">Inbox — jane.doe@example.com</span>
              </div>
              <span className="text-xs text-muted font-mono">3 unread</span>
            </div>

            {/* Email list */}
            <div className="divide-y divide-base-700/20">
              {/* Phishing email */}
              <button
                onClick={() => setView('email')}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-defender/5 transition-colors border-l-2 border-danger/50"
              >
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-danger">SB</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white truncate">Security Team &lt;security@secure-bnk-alert.com&gt;</span>
                    <span className="text-xs text-muted shrink-0">9:41 AM</span>
                  </div>
                  <span className="text-sm text-defender-light truncate block">Urgent: Your account has been suspended</span>
                  <span className="text-xs text-muted truncate block mt-0.5">Dear customer, we have detected suspicious activity on your account. Please verify your identity immediately...</span>
                </div>
                <Star size={14} className="text-muted-dark mt-1 shrink-0" />
              </button>

              {/* Normal email 1 */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-base-800/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-defender/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-defender">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-muted-light truncate">John Davis</span>
                    <span className="text-xs text-muted shrink-0">8:15 AM</span>
                  </div>
                  <span className="text-sm text-muted truncate block">Re: Project update — Q3 roadmap</span>
                  <span className="text-xs text-muted-dark truncate block mt-0.5">Sounds good, let's sync on Thursday. I've reviewed the...</span>
                </div>
              </div>

              {/* Normal email 2 */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-base-800/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-toxic/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-toxic">NT</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-muted-light truncate">Netflix</span>
                    <span className="text-xs text-muted shrink-0">7:02 AM</span>
                  </div>
                  <span className="text-sm text-muted truncate block">New episodes available now</span>
                  <span className="text-xs text-muted-dark truncate block mt-0.5">Your watchlist has new episodes ready to stream...</span>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-base-700/30">
              <button className="p-2 rounded-md hover:bg-base-800/50 text-muted hover:text-defender-light transition-colors">
                <Reply size={14} />
              </button>
              <button className="p-2 rounded-md hover:bg-base-800/50 text-muted hover:text-defender-light transition-colors">
                <Forward size={14} />
              </button>
              <button className="p-2 rounded-md hover:bg-base-800/50 text-muted hover:text-defender-light transition-colors">
                <Trash size={14} />
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setView('email')}
                className="text-xs font-mono text-danger/80 hover:text-danger"
              >
                Open suspicious email →
              </button>
            </div>
          </div>
        )}

        {view === 'email' && (
          <div className="animate-fade-in p-4">
            <button onClick={() => setView('inbox')} className="text-xs text-muted hover:text-defender-light mb-3 flex items-center gap-1">
              <X size={12} /> Close
            </button>
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-white">Urgent: Your account has been suspended</h3>
                <p className="text-xs text-muted mt-1">From: security@secure-bnk-alert.com</p>
              </div>
              <div className="text-sm text-muted-light space-y-2 leading-relaxed">
                <p>Dear Valued Customer,</p>
                <p>
                  We have detected unusual activity on your account. For your security, your account has been
                  temporarily suspended. To restore access, please verify your identity by logging in below.
                </p>
                <p>Failure to verify within 24 hours will result in permanent account closure.</p>
              </div>
              <button
                onClick={() => setView('login')}
                className="btn-glow w-full py-2.5 rounded-lg bg-danger/20 border border-danger/30 text-danger font-semibold text-sm hover:bg-danger/30"
              >
                Verify Your Identity →
              </button>
              <div className="flex items-center gap-1.5 text-xs text-danger/60">
                <ShieldAlert size={12} />
                <span className="font-mono">Sender domain mismatch: secure-bnk-alert.com ≠ secure-bank.com</span>
              </div>
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-full p-6">
            {/* Fake bank login */}
            <div className="w-full max-w-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-defender/20 flex items-center justify-center mb-3 border border-defender/20">
                  <Lock size={24} className="text-defender" />
                </div>
                <h3 className="text-lg font-bold text-white">SecureBank</h3>
                <p className="text-xs text-muted">Online Banking Login</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-light mb-1.5 font-medium">Username</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials((c) => ({ ...c, username: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-base-950/60 border border-base-600/40 text-sm text-white placeholder-muted-dark focus:outline-none focus:border-defender/40 focus:ring-1 focus:ring-defender/20"
                      placeholder="Enter username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-light mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-base-950/60 border border-base-600/40 text-sm text-white placeholder-muted-dark focus:outline-none focus:border-defender/40 focus:ring-1 focus:ring-defender/20"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {formError && <p className="text-xs text-danger">{formError}</p>}

                <button
                  type="submit"
                  className="btn-glow w-full py-2.5 rounded-lg bg-defender/20 border border-defender/30 text-defender font-semibold text-sm hover:bg-defender/30"
                >
                  Sign In
                </button>
              </form>

              {phase === 'captured' && (
                <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30 animate-slide-up">
                  <div className="flex items-center gap-2 text-danger text-sm font-semibold">
                    <ShieldAlert size={16} />
                    Credentials Captured!
                  </div>
                  <p className="text-xs text-danger/70 mt-1 font-mono">
                    Username: {credentials.username || 'jane.doe'}
                  </p>
                  <p className="text-xs text-danger/70 font-mono">
                    Password: {'•'.repeat((credentials.password || 'password').length)}
                  </p>
                  <p className="text-xs text-muted mt-2">
                    This is how attackers steal credentials — always verify the URL and sender domain.
                  </p>
                  <button
                    onClick={resetVictim}
                    className="mt-2 text-xs text-defender hover:text-defender-light font-mono"
                  >
                    [ Reset Victim ]
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

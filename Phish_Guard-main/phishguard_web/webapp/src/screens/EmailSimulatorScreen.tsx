import { useEffect, useState } from 'react';
import { Mail, Star, X, ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { SimBadge } from '@/components/SimBadge';
import { api } from '@/lib/api';
import type { EmailMessage } from '@/types';

const SAMPLE_TIMES = ['9:41 AM', '8:15 AM', '7:30 AM', '7:02 AM', '6:45 AM'];

const fallbackEmails: EmailMessage[] = [
  {
    id: 1,
    from: 'Security Team <security@secure-bnk-alert.com>',
    subject: 'Urgent: Your account has been suspended',
    preview: 'Dear customer, we have detected suspicious activity...',
    body: 'Dear Valued Customer,\n\nWe have detected unusual activity on your account. For your security, your account has been temporarily suspended. To restore access, please verify your identity by clicking the link below.\n\nFailure to verify within 24 hours will result in permanent account closure.\n\n[Verify Your Identity]\n\nThank you,\nSecurity Team',
    isPhish: true,
    time: '9:41 AM',
  },
  {
    id: 2,
    from: 'John Davis <john.davis@company.com>',
    subject: 'Re: Project update — Q3 roadmap',
    preview: 'Sounds good, let\'s sync on Thursday...',
    body: 'Hi,\n\nSounds good, let\'s sync on Thursday. I\'ve reviewed the roadmap and have a few suggestions for the Q3 milestones.\n\nCan we move the API integration to week 2? That would give us more buffer for testing.\n\nThanks,\nJohn',
    isPhish: false,
    time: '8:15 AM',
  },
  {
    id: 3,
    from: 'IT Support <it-support@micros0ft-helpdesk.com>',
    subject: 'Your password expires today — action required',
    preview: 'Your corporate password is set to expire...',
    body: 'Dear User,\n\nYour corporate password is set to expire today at 5:00 PM. To avoid losing access to your account, please reset your password immediately by clicking here.\n\n[Reset Password Now]\n\nIf you do not reset your password, you will be locked out of all company systems.\n\nIT Support Desk',
    isPhish: true,
    time: '7:30 AM',
  },
  {
    id: 4,
    from: 'Netflix <updates@netflix.com>',
    subject: 'New episodes available now',
    preview: 'Your watchlist has new episodes ready to stream...',
    body: 'Hi Jane,\n\nNew episodes are available in your watchlist:\n\n• Stranger Things — Season 5, Episode 3\n• The Crown — Final Season, Episode 8\n\nHappy streaming!\n\nThe Netflix Team',
    isPhish: false,
    time: '7:02 AM',
  },
  {
    id: 5,
    from: 'HR Department <hr@company-payroll-services.net>',
    subject: 'Your W-2 tax form is ready for download',
    preview: 'Please download your W-2 tax form by clicking...',
    body: 'Dear Employee,\n\nYour W-2 tax form for the current year is now available for download. Please click the link below to access and download your tax documents.\n\n[Download W-2 Form]\n\nNote: You will need to enter your SSN and date of birth to verify your identity.\n\nHR Department',
    isPhish: true,
    time: '6:45 AM',
  },
];

export function EmailSimulatorScreen() {
  const [emails, setEmails] = useState<EmailMessage[]>(fallbackEmails);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [verdicts, setVerdicts] = useState<Record<number, 'phish' | 'safe'>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .simulator()
      .then((res) => {
        if (cancelled) return;
        if (res.emails?.length) {
          setEmails(
            res.emails.map((e, i) => ({
              id: i + 1,
              from: `${e.from_name} <${e.from_email}>`,
              subject: e.subject,
              preview: e.body.split('\n').find((l) => l.trim())?.slice(0, 90) ?? '',
              body: e.body,
              isPhish: e.is_phishing,
              time: SAMPLE_TIMES[i % SAMPLE_TIMES.length],
              redFlags: e.red_flags,
            }))
          );
        }
        if (res.source === 'offline' && res.notice) setNotice(res.notice);
      })
      .catch(() => {
        if (!cancelled) setNotice('Could not reach the server — showing offline sample emails.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVerdict = (emailId: number, verdict: 'phish' | 'safe') => {
    setVerdicts((prev) => ({ ...prev, [emailId]: verdict }));
    setShowFeedback(true);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
    setShowFeedback(false);
  };

  const correctCount = Object.entries(verdicts).filter(([id, verdict]) => {
    const email = emails.find((e) => e.id === Number(id));
    return email && ((verdict === 'phish' && email.isPhish) || (verdict === 'safe' && !email.isPhish));
  }).length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-3 text-muted">
        <Loader2 size={28} className="animate-spin text-warning" />
        <p className="text-sm">Loading your inbox...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="text-warning" size={24} />
          <h1 className="text-2xl font-bold text-white">Email Simulator</h1>
          <SimBadge />
        </div>
        <p className="text-sm text-muted max-w-2xl">
          Review each email and decide: is it a phishing attempt or a legitimate message? Get instant feedback.
        </p>
        {notice && <p className="text-xs text-warning/80 font-mono mt-2">{notice}</p>}
      </div>

      {/* Score bar */}
      <div className="glass rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-light">
          Emails analyzed: <span className="text-white font-semibold">{Object.keys(verdicts).length}/{emails.length}</span>
        </span>
        <span className="text-sm text-muted-light">
          Correct: <span className="text-toxic font-semibold">{correctCount}</span>
        </span>
      </div>

      {selectedEmail ? (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <button onClick={closeEmail} className="text-sm text-muted hover:text-defender-light flex items-center gap-1">
              <X size={14} /> Close
            </button>
            {verdicts[selectedEmail.id] && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                (verdicts[selectedEmail.id] === 'phish') === selectedEmail.isPhish
                  ? 'bg-toxic/10 text-toxic border border-toxic/20'
                  : 'bg-danger/10 text-danger border border-danger/20'
              }`}>
                {verdicts[selectedEmail.id] === 'phish' ? 'Flagged as Phishing' : 'Marked as Safe'}
              </span>
            )}
          </div>

          <div className="mb-4 pb-4 border-b border-base-700/30">
            <h2 className="text-lg font-bold text-white mb-2">{selectedEmail.subject}</h2>
            <p className="text-xs text-muted">From: {selectedEmail.from}</p>
            <p className="text-xs text-muted-dark">{selectedEmail.time}</p>
          </div>

          <div className="text-sm text-muted-light leading-relaxed whitespace-pre-line mb-6">
            {selectedEmail.body}
          </div>

          {!verdicts[selectedEmail.id] ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleVerdict(selectedEmail.id, 'phish')}
                className="btn-glow flex-1 py-2.5 rounded-lg bg-danger/15 border border-danger/30 text-danger font-semibold text-sm hover:bg-danger/25 flex items-center justify-center gap-2"
              >
                <AlertTriangle size={16} /> Flag as Phishing
              </button>
              <button
                onClick={() => handleVerdict(selectedEmail.id, 'safe')}
                className="btn-glow flex-1 py-2.5 rounded-lg bg-toxic/15 border border-toxic/30 text-toxic font-semibold text-sm hover:bg-toxic/25 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Mark as Safe
              </button>
            </div>
          ) : (
            showFeedback && (
              <div className={`p-4 rounded-lg border animate-fade-in ${
                (verdicts[selectedEmail.id] === 'phish') === selectedEmail.isPhish
                  ? 'bg-toxic/5 border-toxic/20'
                  : 'bg-danger/5 border-danger/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {(verdicts[selectedEmail.id] === 'phish') === selectedEmail.isPhish ? (
                    <><CheckCircle2 size={16} className="text-toxic" /><span className="text-sm font-semibold text-toxic">Correct!</span></>
                  ) : (
                    <><ShieldAlert size={16} className="text-danger" /><span className="text-sm font-semibold text-danger">Incorrect</span></>
                  )}
                </div>
                {selectedEmail.isPhish && selectedEmail.redFlags?.length ? (
                  <ul className="text-xs text-muted-light leading-relaxed list-disc list-inside space-y-1">
                    {selectedEmail.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-light leading-relaxed">
                    {selectedEmail.isPhish
                      ? 'This IS a phishing email. Look for: spoofed sender domain, urgency tactics, suspicious links, and requests for sensitive information.'
                      : 'This is a legitimate email. The sender domain is correct, the tone is natural, and there are no suspicious requests or links.'}
                  </p>
                )}
                <div className="flex items-start gap-1.5 mt-2 text-xs text-defender/70">
                  <Lightbulb size={12} className="shrink-0 mt-0.5" />
                  <span>Tip: Always verify the sender's email address, not just the display name.</span>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {emails.map((email) => {
            const hasVerdict = verdicts[email.id];
            const isCorrect = hasVerdict && ((verdicts[email.id] === 'phish') === email.isPhish);
            return (
              <button
                key={email.id}
                onClick={() => { setSelectedEmail(email); setShowFeedback(false); }}
                className="group w-full flex items-start gap-3 p-4 rounded-xl glass glass-hover text-left"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  hasVerdict
                    ? isCorrect ? 'bg-toxic/15' : 'bg-danger/15'
                    : 'bg-base-700/40'
                }`}>
                  {hasVerdict ? (
                    isCorrect ? <CheckCircle2 size={16} className="text-toxic" /> : <ShieldAlert size={16} className="text-danger" />
                  ) : (
                    <Mail size={16} className="text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${email.isPhish ? 'text-white' : 'text-muted-light'}`}>
                      {email.from}
                    </span>
                    <span className="text-xs text-muted-dark shrink-0">{email.time}</span>
                  </div>
                  <span className="text-sm text-white truncate block font-medium">{email.subject}</span>
                  <span className="text-xs text-muted truncate block">{email.preview}</span>
                </div>
                <Star size={14} className="text-muted-dark mt-1 shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import { SimBadge } from '@/components/SimBadge';
import { api } from '@/lib/api';
import type { QuizQuestion } from '@/types';

const fallbackQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'An email claims to be from your bank but the sender address is security@secure-bnk-alert.com instead of security@secure-bank.com. What type of attack is this?',
    options: [
      'Domain spoofing — the attacker created a look-alike domain',
      'A legitimate security alert from the bank',
      'A DDoS attack on the mail server',
      'Ransomware encrypting your inbox',
    ],
    correctIndex: 0,
    explanation: 'This is domain spoofing. Attackers register domains that look similar to legitimate ones (bnk vs bank) to trick users into trusting the email.',
  },
  {
    id: 2,
    question: 'Which of the following is the strongest indicator of a phishing email?',
    options: [
      'The email has a professional logo',
      'The email creates false urgency ("Your account will be closed in 24 hours")',
      'The email is formatted in HTML',
      'The email was sent during business hours',
    ],
    correctIndex: 1,
    explanation: 'Urgency and fear are the most common psychological manipulation tactics in phishing. Legitimate organizations rarely demand immediate action under threat.',
  },
  {
    id: 3,
    question: 'You receive an email with a link that displays "https://www.paypal.com" but hovering shows the actual URL is "http://paypal.security-update.ru/login". What is happening?',
    options: [
      'The email client has a display bug',
      'This is a legitimate PayPal security update',
      'Link masking — the displayed text hides the real malicious URL',
      'Your browser needs an update',
    ],
    correctIndex: 2,
    explanation: 'This is link masking. The visible text looks safe, but the actual destination is a malicious site on a .ru domain. Always hover over links to verify the real URL.',
  },
  {
    id: 4,
    question: 'What does DMARC protect against?',
    options: [
      'Malware infections from USB drives',
      'Email domain spoofing and phishing',
      'DDoS attacks',
      'Password brute-force attacks',
    ],
    correctIndex: 1,
    explanation: 'DMARC (Domain-based Message Authentication, Reporting, and Conformance) helps prevent email spoofing by giving email receivers a policy on how to handle unauthenticated emails.',
  },
  {
    id: 5,
    question: 'A "whaling" attack is specifically targeted at which group?',
    options: [
      'Regular employees',
      'IT support staff',
      'High-level executives and C-suite members',
      'Customers of a bank',
    ],
    correctIndex: 2,
    explanation: 'Whaling is a type of spear phishing that targets executives, CEOs, or other high-profile individuals. The "whale" refers to the high value of the target.',
  },
];

export function QuizScreen() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(fallbackQuestions);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .quiz()
      .then((res) => {
        if (cancelled) return;
        if (res.questions?.length) {
          setQuestions(
            res.questions.map((q, i) => ({
              id: i + 1,
              question: q.question,
              options: q.options,
              correctIndex: q.answer,
              explanation: q.explain,
            }))
          );
        }
        if (res.source === 'offline' && res.notice) setNotice(res.notice);
      })
      .catch(() => {
        if (!cancelled) setNotice('Could not reach the server — showing offline sample questions.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const current = questions[currentIdx];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    const isCorrect = idx === current.correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-3 text-muted">
        <Loader2 size={28} className="animate-spin text-toxic" />
        <p className="text-sm">Generating your quiz...</p>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="glass rounded-2xl p-8 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            passed ? 'bg-toxic/15 border border-toxic/30' : 'bg-danger/15 border border-danger/30'
          }`}>
            <Trophy size={32} className={passed ? 'text-toxic' : 'text-danger'} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete</h2>
          <p className="text-sm text-muted mb-6">
            You scored <span className={passed ? 'text-toxic font-bold' : 'text-danger font-bold'}>{score}/{questions.length}</span>
            {' '}({percentage}%)
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {answers.map((correct, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${
                  correct ? 'bg-toxic/15 text-toxic border border-toxic/30' : 'bg-danger/15 text-danger border border-danger/30'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <button
            onClick={handleRestart}
            className="btn-glow px-6 py-2.5 rounded-lg bg-defender/15 border border-defender/30 text-defender font-semibold text-sm hover:bg-defender/25 flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="text-toxic" size={24} />
          <h1 className="text-2xl font-bold text-white">Phishing Quiz</h1>
          <SimBadge />
        </div>
        <p className="text-sm text-muted">Test your ability to identify phishing tactics.</p>
        {notice && <p className="text-xs text-warning/80 font-mono mt-2">{notice}</p>}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < currentIdx ? 'bg-toxic' : i === currentIdx ? 'bg-defender' : 'bg-base-700'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-muted">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="text-xs font-mono text-toxic">Score: {score}</span>
      </div>

      {/* Question card */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5 leading-relaxed">{current.question}</h2>
        <div className="space-y-2">
          {current.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === current.correctIndex;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                  showCorrect
                    ? 'bg-toxic/10 border-toxic/40 text-toxic'
                    : showWrong
                    ? 'bg-danger/10 border-danger/40 text-danger'
                    : isSelected
                    ? 'bg-defender/10 border-defender/30 text-defender'
                    : showResult
                    ? 'bg-base-850/40 border-base-700/20 text-muted-dark'
                    : 'bg-base-850/40 border-base-700/20 text-muted-light hover:border-defender/20 hover:bg-base-800/40'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-mono text-sm shrink-0">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-sm flex-1">{option}</span>
                {showCorrect && <CheckCircle2 size={18} className="text-toxic shrink-0" />}
                {showWrong && <XCircle size={18} className="text-danger shrink-0" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-4 animate-slide-up">
            <div className={`p-3 rounded-lg border ${
              selectedAnswer === current.correctIndex
                ? 'bg-toxic/5 border-toxic/20'
                : 'bg-danger/5 border-danger/20'
            }`}>
              <p className="text-xs font-mono mb-1">
                {selectedAnswer === current.correctIndex ? (
                  <span className="text-toxic">Correct!</span>
                ) : (
                  <span className="text-danger">Incorrect.</span>
                )}
              </p>
              <p className="text-xs text-muted-light leading-relaxed">{current.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="btn-glow mt-4 w-full py-2.5 rounded-lg bg-defender/15 border border-defender/30 text-defender font-semibold text-sm hover:bg-defender/25 flex items-center justify-center gap-2"
            >
              {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

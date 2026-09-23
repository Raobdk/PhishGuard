import {
  BookOpen,
  HelpCircle,
  Mail,
  Bot,
  Crosshair,
  ArrowRight,
  Shield,
  TrendingUp,
  Clock,
  Target,
} from 'lucide-react';
import { SimBadge } from '@/components/SimBadge';
import { StatusPill } from '@/components/StatusPill';
import type { Screen } from '@/types';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const cards = [
    {
      id: 'learn' as Screen,
      title: 'Learn',
      desc: 'Interactive lessons on phishing, social engineering, and defense strategies.',
      icon: BookOpen,
      color: 'defender',
      stat: '12 modules',
    },
    {
      id: 'quiz' as Screen,
      title: 'Quiz',
      desc: 'Test your knowledge with real-world phishing scenarios and timed challenges.',
      icon: HelpCircle,
      color: 'toxic',
      stat: '5 questions',
    },
    {
      id: 'simulator' as Screen,
      title: 'Email Simulator',
      desc: 'Practice spotting phishing emails in a safe, realistic inbox environment.',
      icon: Mail,
      color: 'warning',
      stat: '10 samples',
    },
    {
      id: 'askai' as Screen,
      title: 'Ask the AI',
      desc: 'Chat with an AI security advisor about any cybersecurity question.',
      icon: Bot,
      color: 'defender',
      stat: 'AI-powered',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="text-defender" size={20} />
          <span className="text-xs font-mono text-defender/70 uppercase tracking-widest">SOC Dashboard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Welcome to <span className="text-glow-defender text-defender">PhishGuard</span>
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Your cybersecurity training range. Learn to identify, analyze, and defend against phishing attacks
          through hands-on simulations and interactive modules.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Target, label: 'Threats Blocked', value: '1,247', color: 'text-defender' },
          { icon: TrendingUp, label: 'Skill Level', value: 'Intermediate', color: 'text-toxic' },
          { icon: Clock, label: 'Training Time', value: '4.5 hrs', color: 'text-warning' },
          { icon: Shield, label: 'Defense Score', value: '87/100', color: 'text-defender' },
        ].map((stat) => (
          <div key={stat.label} className="tilt-3d glass glass-hover rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-mono text-muted-dark uppercase">live</span>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Attack Lab card */}
      <button
        onClick={() => onNavigate('lab')}
        className="group relative w-full overflow-hidden rounded-2xl glass glass-hover p-6 mb-6 text-left"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-danger/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-danger/20 blur-xl animate-pulse-glow" />
            <div className="relative w-14 h-14 rounded-xl bg-danger/15 border border-danger/30 flex items-center justify-center">
              <Crosshair size={28} className="text-danger" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">Attack / Victim Lab</h2>
              <StatusPill status="live" />
            </div>
            <p className="text-sm text-muted">
              Watch a live phishing attack unfold in real-time. See both the attacker's terminal and the
              victim's screen as credentials get harvested.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-mono text-danger group-hover:text-glow-danger transition-all">Launch</span>
            <ArrowRight size={18} className="text-danger group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group tilt-3d glass glass-hover rounded-xl p-5 text-left animate-slide-up"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-lg flex items-center justify-center border ${
                  card.color === 'defender'
                    ? 'bg-defender/10 border-defender/20'
                    : card.color === 'toxic'
                    ? 'bg-toxic/10 border-toxic/20'
                    : 'bg-warning/10 border-warning/20'
                }`}
              >
                <card.icon
                  size={22}
                  className={
                    card.color === 'defender'
                      ? 'text-defender'
                      : card.color === 'toxic'
                      ? 'text-toxic'
                      : 'text-warning'
                  }
                />
              </div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider ${
                  card.color === 'defender'
                    ? 'text-defender/60'
                    : card.color === 'toxic'
                    ? 'text-toxic/60'
                    : 'text-warning/60'
                }`}
              >
                {card.stat}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-defender-light transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-3">{card.desc}</p>
            <div
              className={`flex items-center gap-1 text-xs font-mono ${
                card.color === 'defender'
                  ? 'text-defender/70'
                  : card.color === 'toxic'
                  ? 'text-toxic/70'
                  : 'text-warning/70'
              } group-hover:gap-2 transition-all`}
            >
              Open <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-6 glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Clock size={14} className="text-defender" />
          Recent Training Activity
        </h3>
        <div className="space-y-2">
          {[
            { action: 'Completed quiz', module: 'Phishing Identification 101', time: '2 hours ago', status: 'passed' },
            { action: 'Ran simulation', module: 'Bank Credential Phishing', time: '5 hours ago', status: 'completed' },
            { action: 'Started module', module: 'Social Engineering Tactics', time: '1 day ago', status: 'in-progress' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-base-700/20 last:border-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === 'passed' ? 'bg-toxic' : item.status === 'completed' ? 'bg-defender' : 'bg-warning'
                  }`}
                />
                <div>
                  <p className="text-sm text-white">{item.action}: <span className="text-muted-light">{item.module}</span></p>
                </div>
              </div>
              <span className="text-xs text-muted-dark font-mono">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

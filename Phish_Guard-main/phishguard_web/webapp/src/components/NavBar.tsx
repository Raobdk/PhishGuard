import { Shield, ChevronRight } from 'lucide-react';
import type { Screen } from '@/types';

interface NavBarProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'lab', label: 'Attack Lab' },
  { id: 'learn', label: 'Learn' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'simulator', label: 'Email Sim' },
  { id: 'askai', label: 'Ask AI' },
];

export function NavBar({ current, onNavigate }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-base-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-defender/30 blur-md group-hover:bg-defender/50 transition-colors" />
            <Shield className="relative w-6 h-6 text-defender" strokeWidth={2.5} />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-glow-defender">
            Phish<span className="text-defender">Guard</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                current === item.id
                  ? 'text-defender bg-defender/10 border border-defender/20'
                  : 'text-muted hover:text-defender-light hover:bg-base-800/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-base-800/60 border border-base-600/40">
            <div className="h-2 w-2 rounded-full bg-toxic animate-pulse" />
            <span className="text-xs font-mono text-muted-light">SYS_OK</span>
          </div>
          <button
            onClick={() => onNavigate('lab')}
            className="md:hidden p-1.5 rounded-md text-muted hover:text-defender hover:bg-base-800/50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              current === item.id
                ? 'text-defender bg-defender/10 border border-defender/20'
                : 'text-muted hover:text-defender-light'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { SimBadge } from './SimBadge';
import type { LabPhase } from '@/types';

interface TerminalLineData {
  text: string;
  type: 'command' | 'output' | 'success' | 'error' | 'info' | 'capture';
}

interface TerminalProps {
  lines: TerminalLineData[];
  phase: LabPhase;
  onPhaseChange: (phase: LabPhase) => void;
}

const typeColors: Record<string, string> = {
  command: 'text-toxic text-glow-toxic',
  output: 'text-muted-light',
  success: 'text-toxic',
  error: 'text-danger',
  info: 'text-defender',
  capture: 'text-danger text-glow-danger font-bold',
};

const typePrefix: Record<string, string> = {
  command: '$ ',
  output: '',
  success: '[+] ',
  error: '[-] ',
  info: '[*] ',
  capture: '[!] ',
};

export function Terminal({ lines, phase, onPhaseChange }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLines([]);
    setCurrentText('');
    setLineIdx(0);
    setCharIdx(0);
    setIsComplete(false);
  }, [lines]);

  useEffect(() => {
    if (lineIdx >= lines.length) {
      setIsComplete(true);
      onPhaseChange('done');
      return;
    }

    const line = lines[lineIdx];
    const fullText = typePrefix[line.type] + line.text;
    const speed = line.type === 'command' ? 40 : 15;

    if (charIdx <= fullText.length) {
      const timer = setTimeout(() => {
        setCurrentText(fullText.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, lineIdx]);
        setCurrentText('');
        setLineIdx((i) => i + 1);
        setCharIdx(0);

        if (line.type === 'capture') onPhaseChange('captured');
        else if (line.type === 'info' && line.text.includes('Sending')) onPhaseChange('sending');
        else if (line.type === 'info' && line.text.includes('Scanning')) onPhaseChange('scanning');
      }, line.type === 'command' ? 300 : 100);
      return () => clearTimeout(timer);
    }
  }, [lineIdx, charIdx, lines, onPhaseChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines, currentText]);

  const restart = useCallback(() => {
    setVisibleLines([]);
    setCurrentText('');
    setLineIdx(0);
    setCharIdx(0);
    setIsComplete(false);
    onPhaseChange('idle');
  }, [onPhaseChange]);

  return (
    <div className="relative flex flex-col h-full rounded-xl overflow-hidden border border-toxic/20 bg-base-950/80 shadow-lg shadow-toxic/5">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-base-850/80 border-b border-toxic/15">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-danger/80" />
            <span className="w-3 h-3 rounded-full bg-warning/80" />
            <span className="w-3 h-3 rounded-full bg-toxic/80" />
          </div>
          <TerminalIcon size={14} className="text-toxic" />
          <span className="font-mono text-xs text-toxic/80">attacker@phishguard:~</span>
        </div>
        <div className="flex items-center gap-2">
          <SimBadge />
          <StatusPill status={phase === 'idle' ? 'idle' : phase === 'captured' ? 'captured' : phase === 'done' ? 'captured' : 'scanning'} />
        </div>
      </div>

      {/* Terminal body */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto p-4 font-mono text-sm scanlines">
        <div className="relative z-10 space-y-1">
          {visibleLines.map((idx) => {
            const line = lines[idx];
            return (
              <div key={idx} className={`${typeColors[line.type]} animate-fade-in`}>
                {typePrefix[line.type]}
                {line.text}
              </div>
            );
          })}
          {lineIdx < lines.length && (
            <div className={typeColors[lines[lineIdx].type]}>
              {currentText}
              <span className="inline-block w-2 h-4 bg-toxic animate-blink ml-0.5 align-middle" />
            </div>
          )}
          {isComplete && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-toxic/10">
              <button
                onClick={restart}
                className="btn-glow px-3 py-1 rounded text-xs font-mono text-toxic border border-toxic/30 hover:bg-toxic/10"
              >
                [ Run Again ]
              </button>
              <span className="text-muted-dark text-xs font-mono">— session ended</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

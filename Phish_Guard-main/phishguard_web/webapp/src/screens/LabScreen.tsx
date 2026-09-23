import { useState, useCallback } from 'react';
import { Play, RotateCcw, Crosshair, Zap, Info } from 'lucide-react';
import { Terminal } from '@/components/Terminal';
import { VictimBox } from '@/components/VictimBox';
import { SimBadge } from '@/components/SimBadge';
import type { LabPhase } from '@/types';

const attackLines = [
  { text: 'phishguard --launch --target victim-01', type: 'command' as const },
  { text: 'Initializing PhishGuard attack framework v2.1.0...', type: 'info' as const },
  { text: 'Loading credential harvester module...', type: 'info' as const },
  { text: 'Scanning target environment...', type: 'info' as const },
  { text: 'Target OS: Windows 11 | Browser: Chrome 121.0', type: 'output' as const },
  { text: 'Email client detected: Webmail (IMAP/SMTP)', type: 'output' as const },
  { text: 'Crafting phishing email payload...', type: 'info' as const },
  { text: 'Cloned template: SecureBank Online Banking', type: 'output' as const },
  { text: 'Spoofed sender: security@secure-bnk-alert.com', type: 'output' as const },
  { text: 'Sending payload to victim inbox...', type: 'info' as const },
  { text: 'Email delivered successfully.', type: 'success' as const },
  { text: 'Waiting for victim to open email...', type: 'info' as const },
  { text: 'Waiting for victim to click link...', type: 'info' as const },
  { text: 'Victim navigated to fake login page.', type: 'output' as const },
  { text: 'Waiting for credential submission...', type: 'info' as const },
  { text: 'CREDENTIALS CAPTURED!', type: 'capture' as const },
  { text: '  username: jane.doe', type: 'capture' as const },
  { text: '  password: ********', type: 'capture' as const },
  { text: 'Session logged. Attack simulation complete.', type: 'success' as const },
];

export function LabScreen() {
  const [phase, setPhase] = useState<LabPhase>('idle');
  const [started, setStarted] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const handlePhaseChange = useCallback((p: LabPhase) => {
    setPhase(p);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setPhase('scanning');
    setRunKey((k) => k + 1);
  };

  const handleReset = () => {
    setStarted(false);
    setPhase('idle');
    setRunKey((k) => k + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Crosshair className="text-danger" size={24} />
          <h1 className="text-2xl font-bold text-white">Attack / Victim Lab</h1>
          <SimBadge />
        </div>
        <p className="text-sm text-muted max-w-2xl">
          Watch a phishing attack unfold in real-time. The attacker terminal on the left executes a simulated
          credential harvesting campaign while the victim's inbox and browser on the right show what the
          target sees. All traffic is simulated — no real network calls are made.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {!started ? (
          <button
            onClick={handleStart}
            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-lg bg-toxic/15 border border-toxic/30 text-toxic font-semibold text-sm hover:bg-toxic/25"
          >
            <Play size={16} />
            Launch Attack Simulation
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-lg bg-base-700/60 border border-base-600/40 text-muted-light font-semibold text-sm hover:bg-base-600/60"
          >
            <RotateCcw size={16} />
            Reset Simulation
          </button>
        )}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-850/60 border border-base-700/30">
          <Zap size={14} className="text-warning" />
          <span className="text-xs font-mono text-muted-light">
            Phase: <span className={phase === 'idle' ? 'text-muted' : phase === 'captured' ? 'text-danger' : 'text-toxic'}>
              {phase.toUpperCase()}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-850/60 border border-base-700/30">
          <Info size={14} className="text-defender" />
          <span className="text-xs font-mono text-muted-light">Scenario: Bank Credential Phishing</span>
        </div>
      </div>

      {/* Two-column lab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[580px]">
        {/* Attack box */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-mono font-semibold text-toxic/80 uppercase tracking-wider">
              Attack Box
            </h2>
            <span className="text-xs font-mono text-muted-dark">attacker terminal</span>
          </div>
          <div className="flex-1 min-h-0">
            <Terminal
              key={runKey}
              lines={started ? attackLines : [{ text: 'Press "Launch Attack Simulation" to begin.', type: 'output' as const }]}
              phase={phase}
              onPhaseChange={handlePhaseChange}
            />
          </div>
        </div>

        {/* Victim box */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-mono font-semibold text-defender/80 uppercase tracking-wider">
              Victim Box
            </h2>
            <span className="text-xs font-mono text-muted-dark">target device</span>
          </div>
          <div className="flex-1 min-h-0">
            <VictimBox key={runKey} phase={phase} onPhaseChange={handlePhaseChange} />
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Attack Vector', value: 'Email Phishing', color: 'text-danger' },
          { label: 'Technique', value: 'Credential Harvesting', color: 'text-warning' },
          { label: 'Defense Tip', value: 'Verify sender domains', color: 'text-toxic' },
        ].map((item) => (
          <div key={item.label} className="glass rounded-lg px-4 py-3">
            <p className="text-xs text-muted font-mono uppercase tracking-wider">{item.label}</p>
            <p className={`text-sm font-semibold mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type Status = 'live' | 'idle' | 'captured' | 'scanning' | 'active';

interface StatusPillProps {
  status: Status;
  label?: string;
}

const config: Record<Status, { color: string; bg: string; dot: string; defaultLabel: string }> = {
  live: { color: 'text-danger', bg: 'bg-danger/10 border-danger/30', dot: 'bg-danger', defaultLabel: 'LIVE' },
  idle: { color: 'text-muted', bg: 'bg-base-800/60 border-base-600/40', dot: 'bg-muted', defaultLabel: 'idle' },
  captured: { color: 'text-danger', bg: 'bg-danger/15 border-danger/40', dot: 'bg-danger', defaultLabel: 'captured' },
  scanning: { color: 'text-toxic', bg: 'bg-toxic/10 border-toxic/30', dot: 'bg-toxic', defaultLabel: 'scanning' },
  active: { color: 'text-defender', bg: 'bg-defender/10 border-defender/30', dot: 'bg-defender', defaultLabel: 'active' },
};

export function StatusPill({ status, label }: StatusPillProps) {
  const c = config[status];
  const displayLabel = label ?? c.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium ${c.color} ${c.bg}`}
    >
      <span className={`relative flex h-2 w-2`}>
        {status === 'live' && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75 animate-ping-slow`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      </span>
      <span className="uppercase tracking-wider">{displayLabel}</span>
    </span>
  );
}

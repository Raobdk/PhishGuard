import { ShieldCheck } from 'lucide-react';

export function SimBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-toxic/10 border border-toxic/20 text-toxic/80 ${className}`}
    >
      <ShieldCheck size={10} />
      Simulation
    </span>
  );
}

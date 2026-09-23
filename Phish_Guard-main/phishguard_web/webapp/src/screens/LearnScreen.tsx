import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Layers, Lightbulb } from 'lucide-react';
import { SimBadge } from '@/components/SimBadge';
import { api, type ApiModule } from '@/lib/api';

export function LearnScreen() {
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .modules()
      .then((res) => {
        if (cancelled) return;
        if ('modules' in res) {
          setModules(res.modules);
        } else {
          setError(res.error);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not reach the server to load the learning modules.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openModule = (idx: number) => {
    setSelectedIdx(idx);
    setSlideIdx(0);
  };

  const toggleComplete = (idx: number) => {
    setCompleted((prev) => (prev.includes(idx) ? prev.filter((m) => m !== idx) : [...prev, idx]));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-3 text-muted">
        <Loader2 size={28} className="animate-spin text-defender" />
        <p className="text-sm">Loading learning modules...</p>
      </div>
    );
  }

  if (error && modules.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center text-muted">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (selectedIdx !== null) {
    const mod = modules[selectedIdx];
    const slide = mod.slides[slideIdx];
    const isComplete = completed.includes(selectedIdx);
    const isLastSlide = slideIdx === mod.slides.length - 1;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => setSelectedIdx(null)}
          className="text-sm text-muted hover:text-defender-light mb-4 flex items-center gap-1"
        >
          <ChevronLeft size={14} /> Back to modules
        </button>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-defender/60 uppercase tracking-wider">
                Slide {slideIdx + 1} of {mod.slides.length}
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">{mod.title}</h1>
            </div>
            <SimBadge />
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-6">
            {mod.slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= slideIdx ? 'bg-defender' : 'bg-base-700'
                }`}
              />
            ))}
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">{slide.heading}</h2>

          <div className="space-y-3 mb-6">
            {slide.blocks.map((block, i) =>
              block.kind === 'lines' ? (
                <pre
                  key={i}
                  className="text-sm text-muted-light leading-relaxed font-mono whitespace-pre-wrap bg-base-850/40 border border-base-700/20 rounded-lg p-3"
                >
                  {block.lines?.join('\n')}
                </pre>
              ) : (
                <p key={i} className="text-sm text-muted-light leading-relaxed">
                  {block.text}
                </p>
              )
            )}
          </div>

          {slide.highlight && (
            <div className="flex items-start gap-2 p-3.5 rounded-lg bg-toxic/5 border border-toxic/20 mb-6">
              <Lightbulb size={16} className="text-toxic shrink-0 mt-0.5" />
              <p className="text-sm text-toxic/90 leading-relaxed">{slide.highlight}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
              disabled={slideIdx === 0}
              className="btn-glow px-4 py-2.5 rounded-lg bg-base-700/60 border border-base-600/40 text-muted-light font-semibold text-sm hover:bg-base-600/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {!isLastSlide ? (
              <button
                onClick={() => setSlideIdx((i) => Math.min(mod.slides.length - 1, i + 1))}
                className="btn-glow flex-1 py-2.5 rounded-lg bg-defender/15 border border-defender/30 text-defender font-semibold text-sm hover:bg-defender/25 flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => toggleComplete(selectedIdx)}
                className={`btn-glow flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                  isComplete
                    ? 'bg-toxic/15 border border-toxic/30 text-toxic'
                    : 'bg-defender/15 border border-defender/30 text-defender'
                }`}
              >
                <CheckCircle2 size={16} />
                {isComplete ? 'Module Completed' : 'Mark as Complete'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-defender" size={24} />
          <h1 className="text-2xl font-bold text-white">Learn</h1>
          <SimBadge />
        </div>
        <p className="text-sm text-muted max-w-2xl">
          Master cybersecurity fundamentals through structured, interactive modules. Progress at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, idx) => {
          const isComplete = completed.includes(idx);
          return (
            <button
              key={mod.title}
              onClick={() => openModule(idx)}
              className="group tilt-3d glass glass-hover rounded-xl p-5 text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                    isComplete ? 'bg-toxic/10 border-toxic/20' : 'bg-defender/10 border-defender/20'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-toxic" />
                  ) : (
                    <Layers size={18} className="text-defender/60" />
                  )}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border text-defender bg-defender/10 border-defender/20">
                  {mod.slides.length} slides
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-1 group-hover:text-defender-light transition-colors">
                {mod.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed mb-3">
                {mod.slides[0]?.blocks.find((b) => b.kind === 'p')?.text ?? mod.slides[0]?.heading ?? ''}
              </p>
              <span className="text-xs font-mono text-defender/60 group-hover:text-defender flex items-center gap-1">
                {isComplete ? 'Review' : 'Start'} <ChevronRight size={12} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

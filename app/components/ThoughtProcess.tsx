
import { useEffect, useState } from 'react';

type ThoughtProcessProps = {
  isThinking: boolean;
  steps: string[];
};

export function ThoughtProcess({ isThinking, steps }: ThoughtProcessProps) {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);

  useEffect(() => {
    if (steps.length > visibleSteps.length) {
      const timeout = setTimeout(() => {
        setVisibleSteps(steps.slice(0, visibleSteps.length + 1));
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [steps, visibleSteps]);

  if (!isThinking && steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 my-4 px-4 py-3 bg-white/5 border border-white/10 rounded-xl max-w-2xl">
      <div className="flex items-center gap-2 text-xs font-mono text-purple-300 uppercase tracking-widest mb-1">
        {isThinking ? (
            <>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                Thinking Process
            </>
        ) : (
            <>
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Process Complete
            </>
        )}
      </div>
      <div className="space-y-2">
        {visibleSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm text-white/70 animate-in fade-in slide-in-from-left-2 duration-500">
            <span className="text-white/20 font-mono text-xs mt-1">
              {(idx + 1).toString().padStart(2, '0')}
            </span>
            <span>{step}</span>
          </div>
        ))}
        {isThinking && (
            <div className="flex items-center gap-1 ml-7 h-5">
                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce delay-0" />
                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce delay-100" />
                <span className="w-1 h-1 bg-white/20 rounded-full animate-bounce delay-200" />
            </div>
        )}
      </div>
    </div>
  );
}

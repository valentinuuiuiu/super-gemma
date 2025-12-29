
import { useState } from 'react';

type ArtifactProps = {
  title: string;
  type: 'deployment' | 'analysis' | 'code';
  content: unknown;
  status: 'pending' | 'running' | 'success' | 'failed';
};

export function ArtifactPanel({ title, type, status }: ArtifactProps) {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="flex flex-col h-full border-l border-white/10 bg-black/40 backdrop-blur-sm w-80 lg:w-96 shrink-0 transition-all">
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white/90 truncate">{title}</h3>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            status === 'success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
            status === 'running' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
            'border-white/10 text-white/40'
        }`}>
            {status}
        </span>
      </div>

      <div className="flex border-b border-white/10">
        <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'preview' ? 'text-white bg-white/5 border-b-2 border-purple-500' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
            Preview
        </button>
        <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'code' ? 'text-white bg-white/5 border-b-2 border-purple-500' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
            Code
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {type === 'analysis' && (
            <div className="space-y-4">
                <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="text-xs text-white/40 uppercase mb-1">Repo Health</div>
                    <div className="text-2xl font-bold text-white">92<span className="text-sm font-normal text-white/40">/100</span></div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[92%]" />
                    </div>
                </div>

                <div className="space-y-2">
                     <div className="text-xs text-white/40 uppercase">Tech Stack Detected</div>
                     <div className="flex flex-wrap gap-2">
                        {['Next.js', 'Tailwind', 'TypeScript', 'Node.js'].map(tech => (
                            <span key={tech} className="px-2 py-1 rounded text-xs border border-white/10 bg-white/5 text-white/80">
                                {tech}
                            </span>
                        ))}
                     </div>
                </div>

                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-medium text-emerald-200">Ready to Deploy</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                        Structure is compatible with Vercel Edge functions. No critical vulnerabilities found.
                    </p>
                    <button className="w-full mt-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors border border-emerald-500/30">
                        Deploy Now
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

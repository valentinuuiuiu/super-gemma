import { useState } from 'react';

type ArtifactProps = {
  title: string;
  type: 'deployment' | 'analysis' | 'code';
  content: unknown;
  status: 'pending' | 'running' | 'success' | 'failed';
};

export function ArtifactPanel({ title, type, status, content }: ArtifactProps) {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="flex flex-col h-full border-l border-white/10 bg-black/40 backdrop-blur-sm w-80 lg:w-96 shrink-0 transition-all">
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white/90 truncate">{title}</h3>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            status === 'success' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
            status === 'running' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
            status === 'failed' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
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
            Raw Content
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'preview' ? (
          <>
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

            {type === 'code' && (
                <div className="space-y-4">
                   <div className="p-4 rounded-lg border border-white/10 bg-white/5 overflow-x-auto text-sm font-mono text-white/80 whitespace-pre-wrap break-words">
                      {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                   </div>
                </div>
            )}

            {type === 'deployment' && (
                <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Deployment Pipeline</div>
                                <div className="text-xs text-white/50">Vercel Edge Network</div>
                            </div>
                        </div>

                        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                            {[
                                { step: 'Building Project', status: 'done' },
                                { step: 'Optimizing Assets', status: status === 'success' ? 'done' : 'running' },
                                { step: 'Deploying to Edge', status: status === 'success' ? 'done' : 'pending' }
                            ].map((s, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                                        s.status === 'done' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                                        s.status === 'running' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30 animate-pulse' :
                                        'text-white/30'
                                    }`}>
                                        {s.status === 'done' ? (
                                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                             </svg>
                                        ) : s.status === 'running' ? (
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                        )}
                                    </div>
                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 p-2 rounded-lg border border-white/5 bg-white/5 shadow text-xs">
                                        <div className="font-medium text-white/80">{s.step}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {status === 'success' && (
                             <div className="mt-6 p-3 rounded border border-emerald-500/20 bg-emerald-500/10 text-center">
                                 <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1">
                                     Visit Production URL
                                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                 </a>
                             </div>
                        )}
                    </div>
                </div>
            )}
          </>
        ) : (
            <div className="space-y-4">
                 <div className="p-4 rounded-lg border border-white/10 bg-black/50 overflow-x-auto text-xs font-mono text-white/60 whitespace-pre-wrap break-words">
                    {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
}

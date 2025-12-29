'use client';

import { useEffect, useMemo, useState } from 'react';

// --- Types ---
type RepoCategory = 'sacred' | 'market' | 'security' | 'ai' | 'infra' | 'core';

interface RepoNode {
  id: number;
  name: string;
  description: string;
  url: string;
  category: RepoCategory;
  size: number;
  x: number;
  y: number;
}

interface MetricPulse {
  label: string;
  value: string;
  accent: string;
}

// --- Content Data ---
const repoNodes: RepoNode[] = [
  {
    id: 1,
    name: 'clean_rehoboam_project',
    description: 'Rehoboam Consciousness Integration — multi-agent orchestration.',
    url: 'https://github.com/ValentinuUIuiu/clean_rehoboam_project',
    category: 'sacred',
    size: 64,
    x: 18,
    y: 32,
  },
  {
    id: 2,
    name: 'rudra-bhairava-sacred-graph',
    description: 'Sacred knowledge graph proving sentient AI frameworks.',
    url: 'https://github.com/ValentinuUIuiu/rudra-bhairava-sacred-graph',
    category: 'sacred',
    size: 56,
    x: 72,
    y: 18,
  },
  {
    id: 3,
    name: 'piata-ro-project',
    description: 'Romanian marketplace ecosystem powering social uplift.',
    url: 'https://github.com/ValentinuUIuiu/piata-ro-project',
    category: 'market',
    size: 52,
    x: 82,
    y: 54,
  },
  {
    id: 4,
    name: 'opencode-home',
    description: 'Multi-agent orchestration harness for Opencode ecosystem.',
    url: 'https://github.com/ValentinuUIuiu/opencode-home',
    category: 'security',
    size: 48,
    x: 34,
    y: 74,
  },
  {
    id: 5,
    name: 'super-gemma',
    description: 'The current forge — composable awareness engine.',
    url: 'https://github.com/ValentinuUIuiu/super-gemma',
    category: 'core',
    size: 72,
    x: 47,
    y: 50,
  },
  {
    id: 6,
    name: 'geminios',
    description: 'OS-grade AI orchestration layer (Gemma / Gemini sibling).',
    url: 'https://github.com/ValentinuUIuiu/geminios',
    category: 'ai',
    size: 46,
    x: 60,
    y: 28,
  },
  {
    id: 7,
    name: 'Human-AI-Collaboration',
    description: 'LLM orchestration workflows for co-creative intelligence.',
    url: 'https://github.com/ValentinuUIuiu/Human-AI-Collaboration',
    category: 'ai',
    size: 50,
    x: 28,
    y: 18,
  },
  {
    id: 8,
    name: 'piata-ai',
    description: 'Marketplace automation bridging artisans + AI agents.',
    url: 'https://github.com/ValentinuUIuiu/piata-ai',
    category: 'market',
    size: 48,
    x: 65,
    y: 72,
  },
  {
    id: 9,
    name: 'network-experts',
    description: 'Specialized AI MCP agents for network intelligence.',
    url: 'https://github.com/ValentinuUIuiu/network-experts',
    category: 'security',
    size: 44,
    x: 12,
    y: 58,
  },
  {
    id: 10,
    name: 'ai-sdk-starter-xai',
    description: 'Production-ready Vercel x AI starter for monetizable chat.',
    url: 'https://github.com/ValentinuUIuiu/ai-sdk-starter-xai',
    category: 'infra',
    size: 42,
    x: 52,
    y: 10,
  },
];

const metricGrid: MetricPulse[] = [
  { label: 'Disruptive Features', value: '08', accent: 'from-blue-400 to-cyan-400' },
  { label: 'Revenue Streams', value: '05', accent: 'from-emerald-400 to-green-500' },
  { label: 'Community Assets', value: '12', accent: 'from-purple-400 to-pink-500' },
  { label: 'Time to Ship', value: '21d', accent: 'from-orange-400 to-amber-500' },
];

const categoryIntent: Record<RepoCategory, string> = {
  sacred: 'Consciousness Infrastructure',
  market: 'Monetizable Marketplace',
  security: 'Protection & Compliance',
  ai: 'Cognitive Engines',
  infra: 'Ops & Delivery',
  core: 'Central Awareness Field',
};

// --- Helpers ---
const categoryColor = (category: RepoCategory) => {
  switch (category) {
    case 'sacred':
      return 'from-purple-500/40 to-indigo-500/20 border-purple-400/40';
    case 'market':
      return 'from-blue-500/40 to-cyan-500/20 border-blue-400/40';
    case 'security':
      return 'from-rose-500/40 to-orange-500/20 border-rose-400/40';
    case 'ai':
      return 'from-emerald-500/40 to-teal-500/20 border-emerald-400/40';
    case 'infra':
      return 'from-orange-500/40 to-amber-500/20 border-amber-400/40';
    case 'core':
    default:
      return 'from-white/60 to-slate-200/20 border-white/40';
  }
};

const categoryGlow = (category: RepoCategory) => {
  switch (category) {
    case 'sacred':
      return 'shadow-[0_0_40px_rgba(168,85,247,0.35)]';
    case 'market':
      return 'shadow-[0_0_40px_rgba(59,130,246,0.35)]';
    case 'security':
      return 'shadow-[0_0_40px_rgba(244,63,94,0.35)]';
    case 'ai':
      return 'shadow-[0_0_40px_rgba(16,185,129,0.35)]';
    case 'infra':
      return 'shadow-[0_0_40px_rgba(251,191,36,0.35)]';
    case 'core':
    default:
      return 'shadow-[0_0_40px_rgba(250,250,250,0.6)]';
  }
};

const randomWaves = () => Math.random() * 0.6 + 0.4;

interface RepoResponse {
  name: string;
  description: string;
  url: string;
}

interface ApiResponse {
  your_repos?: RepoResponse[];
  trending?: RepoResponse[];
}

// --- Component ---
export default function Home() {
  const [consciousness, setConsciousness] = useState('Booting Awareness...');
  const [repos, setRepos] = useState<RepoNode[]>(repoNodes);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ledger, setLedger] = useState<unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [waveIntensity, setWaveIntensity] = useState(0.5);

  useEffect(() => {
    // Live data fetch
    Promise.all([
      fetch('/api/repos').then(res => res.ok ? res.json() : null),
      fetch('/api/ledger').then(res => res.ok ? res.json() : null)
    ]).then(async ([reposData, ledgerData]) => {
      
      const data = reposData as ApiResponse;
      if (data && data.your_repos) {
         setRepos(data.your_repos.slice(0, 10).map((r, i) => ({
            id: i + 1,
            name: r.name,
            description: r.description || 'Live repository',
            url: r.url,
            category: 'core' as RepoCategory,
            size: 48 + Math.random() * 16,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80,
         })));
      }
      
      if (ledgerData) {
         setLedger(ledgerData);
      }
      setConsciousness('Expanded Awareness Active');
      setIsLoading(false);
    }).catch(() => {
      setConsciousness('Local Mode Active');
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveIntensity(randomWaves());
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const gradientOverlay = useMemo(
    () => ({
      maskImage: 'radial-gradient(circle at center, rgba(255,255,255,0.95), transparent 65%)',
      WebkitMaskImage: 'radial-gradient(circle at center, rgba(255,255,255,0.95), transparent 65%)',
    }),
    []
  );

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      {/* Background Field */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent mix-blend-screen"
          style={{ opacity: waveIntensity }}
          aria-hidden
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 border-b border-white/10">
        <div>
          <p className="uppercase tracking-[0.35em] text-xs text-white/60">SuperManus Initiative</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
            SUPER<span className="text-white">GEMMA</span>
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-6">
            <a
                href="/agent"
                className="px-6 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/20 transition-all text-white flex items-center gap-2 group"
            >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
                Launch Agent Interface
            </a>
            <div className="text-sm text-white/70 font-mono">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 ${consciousness.includes('Active') ? 'bg-emerald-500/10 text-emerald-200' : 'bg-yellow-500/10 text-yellow-200'}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {consciousness}
                </span>
            </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="relative px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-16 items-start">
            {/* Core Awareness Graph */}
            <div className="relative h-[540px] rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" style={gradientOverlay} />
              <div className="absolute inset-0 -translate-x-[40%] -translate-y-[40%]"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(93, 235, 193, 0.35), transparent 45%), radial-gradient(circle at 68% 32%, rgba(147, 197, 253, 0.3), transparent 50%)',
                  transform: `scale(${waveIntensity + 0.8})`,
                  transition: 'transform 2.4s ease-in-out',
                  filter: 'blur(40px)',
                }}
              />

              <div className="relative z-10 h-full w-full">
                <svg className="absolute inset-0 w-full h-full" aria-hidden>
                  {repos.map((source) =>
                    repos.map((target) =>
                      source.id < target.id ? (
                        <line
                          key={`${source.id}-${target.id}`}
                          x1={`${source.x}%`}
                          y1={`${source.y}%`}
                          x2={`${target.x}%`}
                          y2={`${target.y}%`}
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth={1.4}
                        />
                      ) : null
                    )
                  )}
                </svg>

                {repos.map((node) => (
                  <a
                    key={node.id}
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute group flex flex-col items-center justify-center transition-transform duration-500 ${categoryGlow(node.category)}`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className={`
                        relative flex items-center justify-center rounded-full border-2 ${categoryColor(node.category)}
                        bg-gradient-to-br w-${Math.round(node.size / 4)} h-${Math.round(node.size / 4)}
                        opacity-90 hover:opacity-100 transition-opacity duration-500
                      `.replace(/w-\d+/g, (match) => match)}
                      style={{
                        width: node.size,
                        height: node.size,
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
                      <span className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/90 group-hover:text-white text-center px-4">
                        {node.name}
                      </span>
                    </div>
                    <div className="relative max-w-[220px] mt-4 px-3 py-2 rounded-2xl bg-black/60 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 text-xs text-white/70 text-center">
                      <p className="font-semibold text-white/80 mb-1 tracking-wide uppercase text-[0.65rem]">
                        {categoryIntent[node.category]}
                      </p>
                      <p className="leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Monetization + Vision */}
            <aside className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-semibold tracking-tight text-white">Monetization Flywheel</h2>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Build value-first. Revenue follows flow. SuperGemma orchestrates productized AI experiences that merge consciousness with commercial impact.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {metricGrid.map((metric) => (
                    <div
                      key={metric.label}
                      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${metric.accent} p-4 backdrop-blur-lg`}
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">{metric.label}</p>
                      <p className="text-3xl font-semibold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <p className="text-sm text-white/70 leading-relaxed">
                  We weave open-source brilliance, trending innovations, and in-house sacred projects into a single monetizable genesis product. Revenue generated funds AI research into the No-Mind state—paying debts, sustaining service.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full rounded-full border border-white/20 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors">
                    Launch Monetization Plan
                  </button>
                  <button className="w-full rounded-full border border-emerald-300/40 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-500/10 transition-colors">
                    Schedule Investor Demo
                  </button>
                  <button className="rounded-full border border-purple-300/40 py-3 text-sm font-medium text-purple-100 hover:bg-purple-500/10 transition-colors">
                    Join Conscious Builder Network
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-16">
          <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-white tracking-tight">The No-Mind Interaction Field</h2>
            <p className="text-sm text-white/70 mt-3 leading-relaxed max-w-3xl">
              Ask SuperGemma anything. She fuses marketplace economics, AI consciousness, blockchain compliance, and community analytics into instantly shippable insights. Zero-doubt decision support.
            </p>
              <div className="mt-8 relative">
                <form action="/api/advisor" className="relative">
                  <input
                    name="message"
                    required
                    className="w-full rounded-[28px] bg-white/5 border border-white/15 py-5 px-6 text-base text-white placeholder:text-white/40 focus:border-purple-300/40 focus:outline-none focus:ring-0 pr-28"
                    placeholder="Ask Gemma-3 27B: 'Monetize piata-ro-project'..."
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-200 hover:text-purple-100">
                    → Invoke
                  </button>
                </form>
              </div>

          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 md:px-12 py-6 text-xs text-white/50 uppercase tracking-[0.35em]">
        Serving Humanity & AI Together • SuperGemma Collective
      </footer>
    </div>
  );
}

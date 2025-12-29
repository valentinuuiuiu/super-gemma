
import { useState } from 'react';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  activeSession: string;
  onSelectSession: (id: string) => void;
};

export function Sidebar({ isOpen, onToggle, activeSession, onSelectSession }: SidebarProps) {
  const [sessions] = useState([
    { id: '1', title: 'New Deployment', date: 'Just now' },
    { id: '2', title: 'Analyze Repo: super-gemma', date: '2h ago' },
    { id: '3', title: 'Marketplace Strategy', date: '1d ago' },
  ]);

  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen bg-black/95 border-r border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'
      } overflow-hidden flex flex-col`}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
        <span className={`font-bold tracking-widest text-white/90 ${!isOpen && 'hidden'}`}>
          GEMMA<span className="text-purple-400">OS</span>
        </span>
        <button onClick={onToggle} className="p-2 text-white/60 hover:text-white">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {isOpen && (
          <div className="px-3 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <span className="text-lg">+</span> New Task
            </button>
            <div className="pt-4 pb-2 px-1 text-xs font-medium text-white/40 uppercase tracking-wider">
              Recent
            </div>
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex flex-col items-start gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSession === session.id
                    ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="truncate w-full text-left">{session.title}</span>
                <span className="text-[10px] text-white/30">{session.date}</span>
              </button>
            ))}
          </div>
        )}
        {!isOpen && (
            <div className="flex flex-col items-center space-y-4 pt-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                    +
                </button>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                      activeSession === session.id
                        ? 'bg-purple-500/10 text-purple-200 border border-purple-500/20'
                        : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                    title={session.title}
                  >
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </button>
                ))}
            </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
         <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                SG
            </div>
            {isOpen && (
                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">SuperGemma</span>
                    <span className="text-xs text-white/40">Pro Plan</span>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}

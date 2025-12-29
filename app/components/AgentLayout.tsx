
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { ArtifactPanel } from './ArtifactPanel';

// Define a type for artifacts to avoid 'any'
export type Artifact = {
  title: string;
  type: 'deployment' | 'analysis' | 'code';
  content: unknown; // Safe alternative to any
  status: 'pending' | 'running' | 'success' | 'failed';
};

export default function AgentLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeSession, setActiveSession] = useState('1');
  const [artifact, setArtifact] = useState<Artifact | null>(null);

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden text-white font-sans selection:bg-purple-500/30">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        activeSession={activeSession}
        onSelectSession={setActiveSession}
      />

      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-16'}`}>
        <div className="flex-1 flex overflow-hidden">
            <ChatInterface onArtifact={setArtifact} />
            {artifact && (
                <ArtifactPanel
                    title={artifact.title}
                    type={artifact.type}
                    content={artifact.content}
                    status={artifact.status}
                />
            )}
        </div>
      </main>
    </div>
  );
}

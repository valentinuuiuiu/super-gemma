
import { useState, useRef, useEffect } from 'react';
import { ThoughtProcess } from './ThoughtProcess';
import { Artifact } from './AgentLayout';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughts?: string[];
  isThinking?: boolean;
};

export function ChatInterface({ onArtifact }: { onArtifact: (artifact: Artifact) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: "I am SuperGemma. I can analyze repositories, plan deployments, and optimize your agentic workflows. Paste a GitHub URL or ask a question.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulation of "Super Gemma" Agent Logic
    const responseId = (Date.now() + 1).toString();

    // Initial thinking state
    setMessages(prev => [...prev, {
      id: responseId,
      role: 'assistant',
      content: '',
      isThinking: true,
      thoughts: ['Analyzing intent...', 'Scanning knowledge base...']
    }]);

    // Simulate thinking steps based on input
    const isRepo = input.includes('github.com');
    const thoughtSequence = isRepo
        ? ['Identifying repository structure...', 'Cloning metadata...', 'Analyzing dependencies...', 'Checking for Dockerfile...', 'Generating deployment matrix...']
        : ['Parsing query semantic...', 'Retrieving context from active session...', 'Formulating response...'];

    let currentThoughts = [...thoughtSequence.slice(0, 2)];

    // Step-by-step update
    for (let i = 2; i <= thoughtSequence.length; i++) {
        await new Promise(r => setTimeout(r, 800));
        currentThoughts = thoughtSequence.slice(0, i);
        setMessages(prev => prev.map(m => m.id === responseId ? { ...m, thoughts: currentThoughts } : m));
    }

    await new Promise(r => setTimeout(r, 500));

    // Final response generation
    let finalContent = "";
    if (isRepo) {
        finalContent = `I've analyzed the repository. It appears to be a robust application. I've prepared a deployment plan and identified the stack. Check the artifact panel for details.`;
        onArtifact({
            title: 'Analysis: ' + input.split('/').pop(),
            type: 'analysis',
            status: 'success',
            content: { health: 92 }
        });
    } else {
        finalContent = "I understand. I can help you with that. My architecture is designed to handle complex agentic workflows. How would you like to proceed?";
    }

    setMessages(prev => prev.map(m => m.id === responseId ? {
        ...m,
        content: finalContent,
        isThinking: false
    } : m));

    setIsProcessing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black/20">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl w-full ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
               {msg.role === 'assistant' && (
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                        SG
                     </div>
                     <div className="flex-1">
                        <div className="font-semibold text-white/90 text-sm mb-1">SuperGemma</div>
                        {msg.thoughts && <ThoughtProcess isThinking={!!msg.isThinking} steps={msg.thoughts} />}
                        {msg.content && (
                            <div className="text-white/80 leading-relaxed whitespace-pre-wrap animate-in fade-in duration-500">
                                {msg.content}
                            </div>
                        )}
                     </div>
                  </div>
               )}
               {msg.role === 'user' && (
                  <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                     {msg.content}
                  </div>
               )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 pb-8">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message SuperGemma..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                disabled={isProcessing}
            />
            <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-white/30">
            SuperGemma can make mistakes. Verify critical deployments.
          </div>
        </div>
      </div>
    </div>
  );
}

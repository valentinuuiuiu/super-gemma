
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
      content: "I am SuperGemma (powered by Gemma 3 27B). I can analyze repositories, plan deployments, and optimize your agentic workflows. Paste a GitHub URL or ask a question.",
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

    const responseId = (Date.now() + 1).toString();

    // Initial placeholder for assistant response
    setMessages(prev => [...prev, {
      id: responseId,
      role: 'assistant',
      content: '',
      isThinking: true,
      thoughts: []
    }]);

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messages.concat(userMsg).map(m => ({ role: m.role, content: m.content }))
            })
        });

        if (!response.ok) {
             throw new Error('Failed to communicate with Agent API');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No stream reader');

        let rawBuffer = '';
        let currentThoughts: string[] = [];
        let currentContent = '';

        // This simple parser handles the stream and splits tags.
        // Note: Real parsing of partial XML tags across chunks is complex,
        // but for this demo we accumulate buffer and regex match.

        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            rawBuffer += chunk;

            // Extract Thinking
            const thoughtMatch = rawBuffer.match(/<thinking>([\s\S]*?)<\/thinking>/g);
            if (thoughtMatch) {
                // Get all complete thoughts
                currentThoughts = thoughtMatch.map(t => t.replace(/<\/?thinking>/g, '').trim());
            } else {
                // Handle open thinking tag (streaming in progress thought)
                 const openThought = rawBuffer.match(/<thinking>([\s\S]*?)$/);
                 if (openThought) {
                     // Show the current partial thought as the last item
                     const partial = openThought[1].trim();
                     if (partial) {
                         // We display the partial thought at the end of the array
                         // But we don't want to duplicate completed ones, so we handle logic carefully
                         // For simplicity, we just display what we have fully parsed + current tail if needed
                         // Let's rely on completed blocks for the list, and maybe a "..." for active
                     }
                 }
            }

            // Extract Artifacts
            const artifactMatch = rawBuffer.match(/<artifact\s+title="([^"]+)"\s+type="([^"]+)">([\s\S]*?)<\/artifact>/);
            if (artifactMatch) {
                 const [, title, type, content] = artifactMatch;
                 onArtifact({
                     title,
                     type: type as 'code' | 'deployment' | 'analysis',
                     content,
                     status: 'success'
                 });
                 // Remove artifact from displayed content to keep chat clean?
                 // Or keep it. Let's remove it from the "content" we show in chat bubbles if desired.
                 // For now, we'll strip it from the rawBuffer used for content display.
            }

            // Clean Content for display (Remove tags)
            // We want to show everything NOT inside <thinking> or <artifact> tags
            // This is a naive regex replacement for the stream update
            const cleanText = rawBuffer
                .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // Remove completed thoughts
                .replace(/<thinking>[\s\S]*/g, '') // Remove active thought
                .replace(/<artifact[\s\S]*?<\/artifact>/g, '') // Remove artifacts
                .replace(/<artifact[\s\S]*/g, ''); // Remove active artifact

            currentContent = cleanText.trim();

            setMessages(prev => prev.map(m => m.id === responseId ? {
                ...m,
                content: currentContent,
                thoughts: currentThoughts.length > 0 ? currentThoughts : m.thoughts,
                isThinking: true // Still thinking until done
            } : m));
        }

        // Finalize
         setMessages(prev => prev.map(m => m.id === responseId ? {
            ...m,
            isThinking: false
        } : m));

    } catch (error) {
        console.error(error);
        setMessages(prev => prev.map(m => m.id === responseId ? {
            ...m,
            content: "I encountered an error connecting to the neural core. Please check your connection or API keys.",
            isThinking: false
        } : m));
    } finally {
        setIsProcessing(false);
    }
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
                        {msg.thoughts && msg.thoughts.length > 0 && <ThoughtProcess isThinking={!!msg.isThinking} steps={msg.thoughts} />}
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

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { processAgentRequest } from '@/app/lib/agent-logic';

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: false,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    // FALLBACK: If no API key, use the mock logic from agent-logic.ts
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn("OPENROUTER_API_KEY is not set. Using fallback mock response.");

        const mockResult = await processAgentRequest(lastMessage);

        // Construct the response in the format the client expects
        let formattedResponse = `<thinking>\n${mockResult.thoughts.join('\n')}\n</thinking>\n\n${mockResult.response}`;

        if (mockResult.artifact) {
            let artifactContent = '';
            if (typeof mockResult.artifact.content === 'object') {
                artifactContent = JSON.stringify(mockResult.artifact.content, null, 2);
            } else {
                artifactContent = String(mockResult.artifact.content);
            }

            formattedResponse += `\n\n<artifact title="${mockResult.artifact.title}" type="code">\n${artifactContent}\n</artifact>`;
        }

        // Create a stream for the mock response
        const stream = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                // Simulate streaming by splitting chunks
                const chunks = formattedResponse.split('\n');
                let i = 0;
                const interval = setInterval(() => {
                    if (i >= chunks.length) {
                        clearInterval(interval);
                        controller.close();
                        return;
                    }
                    controller.enqueue(encoder.encode(chunks[i] + '\n'));
                    i++;
                }, 50); // Small delay for effect
            }
        });

        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }

    // REAL MODE: Use OpenRouter
    const systemPrompt = {
      role: 'system',
      content: `You are Gemma 3, an advanced AI agent operating within the SuperGemma OS.

      Your goal is to assist users by reasoning through problems and creating artifacts (code, documents, diagrams).

      CRITICAL INSTRUCTIONS:
      1. You MUST use <thinking> tags to output your internal monologue and reasoning process before your final answer. The user will see this in a special "Thought Process" panel.
      2. If you generate code, plans, or specific structured content, enclose it in <artifact title="Artifact Name" type="code|markdown|plan"> content... </artifact> tags.
      3. Be concise but deep in your reasoning.
      4. You have access to "real-time" context simulated by the OS, so act as a capable, autonomous agent.

      Example format:
      <thinking>
      The user wants a React component. I should consider the props and styling.
      </thinking>
      Here is the component you requested:
      <artifact title="Button.tsx" type="code">
      export const Button = () => <button>Click me</button>;
      </artifact>
      `
    };

    const fullMessages = [systemPrompt, ...messages];

    const response = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it:free',
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

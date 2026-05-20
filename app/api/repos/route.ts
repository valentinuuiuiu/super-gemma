import { NextResponse } from 'next/server';

// Mock data to replace the real GitHub API call since we lack a token
const MOCK_REPOS = [
  {
    name: 'manus',
    description: 'AI Agent that deploys apps',
    url: 'https://github.com/manus-ai/manus',
    stargazers_count: 15000,
    updated_at: new Date().toISOString()
  },
  {
    name: 'open-manus',
    description: 'Open source alternative to Manus',
    url: 'https://github.com/openmanus-ai/openmanus',
    stargazers_count: 12000,
    updated_at: new Date().toISOString()
  },
  {
    name: 'super-gemma',
    description: 'The current forge — composable awareness engine.',
    url: 'https://github.com/ValentinuUIuiu/super-gemma',
    stargazers_count: 888,
    updated_at: new Date().toISOString()
  },
  {
    name: 'deepseek-v3',
    description: 'Reasoning model for agents',
    url: 'https://github.com/deepseek-ai/deepseek-v3',
    stargazers_count: 45000,
    updated_at: new Date().toISOString()
  },
  {
    name: 'langflow',
    description: 'Visual builder for AI agents',
    url: 'https://github.com/langflow-ai/langflow',
    stargazers_count: 32000,
    updated_at: new Date().toISOString()
  }
];

export async function GET() {
  // Return mock data that matches the structure expected by the frontend
  return NextResponse.json({
    your_repos: MOCK_REPOS.map(r => ({
      name: r.name,
      stars: r.stargazers_count,
      description: r.description,
      url: r.url,
      updated: r.updated_at
    })),
    trending: MOCK_REPOS.map(r => ({
      name: r.name,
      stars: r.stargazers_count,
      description: r.description,
      url: r.url
    })),
    timestamp: new Date().toISOString()
  });
}
